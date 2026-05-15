"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { useBusinessStore } from "@/lib/zustandStore/useBusinessStore";
import { getCurrentUser } from "./getCurrentUser";

// ============================================================================
// CREATE LEAD
// ============================================================================

type CreateLeadPayload = {
  name?: string;

  contact?: string;

  email?: string;

  message?: string;

  service?: string;

  source?: string;

  notes?: string;

  assignedTo?: string;

  businessProfileId: string;
};

export async function createLead(payload: CreateLeadPayload) {
  const user = await getCurrentUser();

  console.log("Current User:", user); // Debugging log
  if (!user || typeof user === "string") {
    throw new Error("Invalid user data");
  }

  const id = user?.id;
  console.log("Admin ID:", id); // Debugging log

  const businessProfile = await prisma.businessProfile.findFirst({
    where: {
      ownerId: id,
    },
  });

  console.log("Business Profile found ", businessProfile); // Debugging log

  try {
    const lead = await prisma.lead.create({
      data: {
        name: payload.name,

        contact: payload.contact,

        email: payload.email,

        message: payload.message,

        service: payload.service,

        source: payload.source,

        notes: payload.notes,

        assignedTo: payload.assignedTo,
        businessProfile: {
          connect: {
            id: businessProfile!.id,
          },
        },
      },
    });

    return {
      success: true,

      data: lead,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,

      error: "Failed to create lead",
    };
  }
}

// ============================================================================
// GET LEADS
// ============================================================================

export async function getLeads() {
  const user = await getCurrentUser();

  console.log("Current User:", user); // Debugging log
  if (!user || typeof user === "string") {
    throw new Error("Invalid user data");
  }

  const id = user?.id;
  console.log("Admin ID:", id); // Debugging log

  const businessProfile = await prisma.businessProfile.findFirst({
    where: {
      ownerId: id,
    },
  });

  console.log("Business Profile found ", businessProfile); // Debugging log
  try {
    const leads = await prisma.lead.findMany({
      where: {
        businessProfileId: businessProfile?.id,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,

      data: leads,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,

      error: "Failed to fetch leads",
    };
  }
}

// ============================================================================
// UPDATE LEAD
// ============================================================================

type UpdateLeadPayload = {
  id: string;

  name?: string;

  contact?: string;

  email?: string;

  message?: string;

  service?: string;

  source?: string;

  status?: "NEW" | "CONTACTED" | "CLOSED";

  contacted?: boolean;

  starred?: boolean;

  assignedTo?: string;

  notes?: string;
};

export async function updateLead(payload: UpdateLeadPayload) {
  try {
    const lead = await prisma.lead.update({
      where: {
        id: payload.id,
      },

      data: {
        name: payload.name,

        contact: payload.contact,

        email: payload.email,

        message: payload.message,

        service: payload.service,

        source: payload.source,

        status: payload.status,

        contacted: payload.contacted,

        starred: payload.starred,

        assignedTo: payload.assignedTo,

        notes: payload.notes,
      },
    });

    revalidatePath("/admin/leads");

    return {
      success: true,

      data: lead,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,

      error: "Failed to update lead",
    };
  }
}

// ============================================================================
// DELETE LEAD
// ============================================================================

export async function deleteLead(id: string) {
  try {
    await prisma.lead.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/leads");

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,

      error: "Failed to delete lead",
    };
  }
}

// ============================================================================
// MARK AS CONTACTED
// ============================================================================

// export async function markLeadAsContacted(id: string) {
//   try {
//     const lead = await prisma.lead.update({
//       where: {
//         id,
//       },

//       data: {
//         contacted: true,

//         status: "CONTACTED",
//       },
//     });

//     revalidatePath("/admin/leads");

//     return {
//       success: true,

//       data: lead,
//     };
//   } catch (error) {
//     console.error(error);

//     return {
//       success: false,

//       error: "Failed to mark lead contacted",
//     };
//   }
// }
export async function bulkUpdateLeads(
  ids: string[],
  data: {
    contacted?: boolean;
    starred?: boolean;
    status?: "NEW" | "CONTACTED" | "CLOSED";
  },
) {
  try {
    if (!ids.length) {
      return {
        success: false,
        error: "No lead ids provided",
      };
    }

    await prisma.lead.updateMany({
      where: {
        id: {
          in: ids,
        },
      },

      data,
    });

    revalidatePath("/admin/leads");

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: "Failed to bulk update leads",
    };
  }
}
// ============================================================================
// MARK AS CLOSED
// ============================================================================

export async function closeLead(id: string) {
  try {
    const lead = await prisma.lead.update({
      where: {
        id,
      },

      data: {
        status: "CLOSED",
      },
    });

    revalidatePath("/admin/leads");

    return {
      success: true,

      data: lead,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,

      error: "Failed to close lead",
    };
  }
}

// ============================================================================
// RESET LEAD
// ============================================================================

export async function resetLead(id: string) {
  try {
    const lead = await prisma.lead.update({
      where: {
        id,
      },

      data: {
        status: "NEW",

        contacted: false,
      },
    });

    revalidatePath("/admin/leads");

    return {
      success: true,

      data: lead,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,

      error: "Failed to reset lead",
    };
  }
}

// ============================================================================
// TOGGLE STAR LEAD
// ============================================================================

export async function toggleStarLead(id: string) {
  try {
    const existingLead = await prisma.lead.findUnique({
      where: {
        id,
      },

      select: {
        starred: true,
      },
    });

    if (!existingLead) {
      return {
        success: false,

        error: "Lead not found",
      };
    }

    const lead = await prisma.lead.update({
      where: {
        id,
      },

      data: {
        starred: !existingLead.starred,
      },
    });

    revalidatePath("/admin/leads");

    return {
      success: true,

      data: lead,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,

      error: "Failed to toggle star",
    };
  }
}
