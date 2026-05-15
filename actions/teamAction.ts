/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { prisma } from "@/lib/prisma";

// ============================================================================
// TYPES
// ============================================================================

interface StaffAvailabilityInput {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface StaffLeaveInput {
  startDate: Date | string;
  endDate?: Date | string | null;
  reason?: string;
}

interface CreateStaffData {
  name: string;

  phone?: string;
  email?: string;
  address?: string;

  businessProfileId: string;

  serviceIds?: string[];

  availability?: StaffAvailabilityInput[];

  leaves?: StaffLeaveInput[];
}

interface UpdateStaffData {
  name?: string;

  phone?: string | null;
  email?: string | null;
  address?: string | null;

  serviceIds?: string[];

  availability?: StaffAvailabilityInput[];

  leaves?: StaffLeaveInput[];
}

// ============================================================================
// CREATE STAFF
// ============================================================================

export async function createStaff(data: CreateStaffData) {
  try {
    const {
      name,
      phone,
      email,
      address,
      businessProfileId,
      serviceIds = [],
      availability = [],
      leaves = [],
    } = data;

    // ================= VALIDATION =================

    if (!name.trim()) {
      throw new Error("Staff name is required");
    }

    if (!businessProfileId) {
      throw new Error("Business profile ID is required");
    }

    // ================= CREATE =================

    const staff = await prisma.staff.create({
      data: {
        name: name.trim(),

        phone: phone?.trim() || null,

        email: email?.trim().toLowerCase() || null,

        address: address?.trim() || null,

        businessProfileId,

        // ================= SERVICES =================

        services: {
          create: serviceIds.map((serviceId) => ({
            serviceId,
          })),
        },

        // ================= AVAILABILITY =================

        availability: {
          create: availability.map((slot) => ({
            dayOfWeek: slot.dayOfWeek,

            startTime: slot.startTime,

            endTime: slot.endTime,
          })),
        },

        // ================= LEAVES =================

        leaves: {
          create: leaves.map((leave) => ({
            startDate: new Date(leave.startDate),

            endDate: leave.endDate ? new Date(leave.endDate) : null,

            reason: leave.reason || null,
          })),
        },
      },

      include: {
        services: {
          include: {
            service: true,
          },
        },

        availability: true,

        leaves: true,
      },
    });

    return {
      success: true,

      data: staff,

      message: "Staff created successfully",
    };
  } catch (error: any) {
    console.error("CREATE STAFF ERROR:", error);

    return {
      success: false,

      error: error.message || "Failed to create staff",
    };
  }
}

// ============================================================================
// GET ALL STAFF
// ============================================================================
export async function getStaffs(businessProfileId: string) {
  try {
    if (!businessProfileId) {
      throw new Error("Business profile ID required");
    }

    const staffs = await prisma.staff.findMany({
      where: {
        businessProfileId,
      },

      include: {
        services: {
          include: {
            service: true,
          },
        },

        availability: {
          orderBy: {
            dayOfWeek: "asc",
          },
        },

        leaves: {
          orderBy: {
            startDate: "desc",
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: staffs,
    };
  } catch (error: any) {
    console.error(error);

    return {
      success: false,
      data: [],
      error: error.message,
    };
  }
}

// ============================================================================
// GET SINGLE STAFF
// ============================================================================

export async function getStaffById(staffId: string) {
  try {
    if (!staffId) {
      throw new Error("Staff ID is required");
    }

    const staff = await prisma.staff.findUnique({
      where: {
        id: staffId,
      },

      include: {
        services: {
          include: {
            service: true,
          },
        },

        availability: true,

        leaves: true,

        bookings: true,

        bookingItems: true,
      },
    });

    if (!staff) {
      throw new Error("Staff not found");
    }

    return {
      success: true,

      data: staff,
    };
  } catch (error: any) {
    console.error("GET STAFF BY ID ERROR:", error);

    return {
      success: false,

      data: null,

      error: error.message || "Failed to fetch staff",
    };
  }
}

// ============================================================================
// UPDATE STAFF
// ============================================================================

export async function updateStaff(staffId: string, data: UpdateStaffData) {
  try {
    if (!staffId) {
      throw new Error("Staff ID is required");
    }

    console.log("Updating staff with data:", { staffId, ...data });

    const existingStaff = await prisma.staff.findUnique({
      where: {
        id: staffId,
      },

      include: {
        services: {
          include: {
            service: true,
          },
        },

        availability: true,

        leaves: true,
      },
    });

    if (!existingStaff) {
      throw new Error("Staff not found");
    }

    const updated = await prisma.$transaction(async (tx) => {
      // ================= UPDATE BASIC INFO =================

      await tx.staff.update({
        where: {
          id: staffId,
        },

        data: {
          ...(data.name && {
            name: data.name.trim(),
          }),

          ...(data.phone !== undefined && {
            phone: data.phone?.trim() || null,
          }),

          ...(data.email !== undefined && {
            email: data.email?.trim().toLowerCase() || null,
          }),

          ...(data.address !== undefined && {
            address: data.address?.trim() || null,
          }),
        },
      });

      // ================= UPDATE SERVICES =================

      if (data.serviceIds) {
        // remove old
        await tx.staffService.deleteMany({
          where: {
            staffId,
          },
        });

        // create new
        if (data.serviceIds.length > 0) {
          await tx.staffService.createMany({
            data: data.serviceIds.map((serviceId) => ({
              staffId,
              serviceId,
            })),
          });
        }
      }

      // ================= UPDATE AVAILABILITY =================

      if (data.availability) {
        await tx.staffAvailability.deleteMany({
          where: {
            staffId,
          },
        });

        if (data.availability.length > 0) {
          await tx.staffAvailability.createMany({
            data: data.availability.map((slot) => ({
              staffId,

              dayOfWeek: slot.dayOfWeek,

              startTime: slot.startTime,

              endTime: slot.endTime,
            })),
          });
        }
      }

      // ================= UPDATE LEAVES =================

      // ================= UPDATE LEAVES =================

if (data.leaves) {
 

  const validLeaves =
    data.leaves
      ?.filter((leave) => {
        if (!leave.startDate) {
          return false;
        }

        return typeof leave.startDate === 'string'
          ? leave.startDate.trim().length > 0
          : true;
      })
      .map((leave) => {
        const startDate = new Date(leave.startDate);

        const endDate = leave.endDate
          ? new Date(leave.endDate)
          : null;

        return {
          staffId,
          startDate,
          endDate,
          reason: leave.reason?.trim() || null,
        };
      }) || [];

  if (validLeaves.length > 0) {
    await tx.staffLeave.createMany({
      data: validLeaves,
    });
  }
}

      // ================= RETURN UPDATED =================

      return await tx.staff.findUnique({
        where: {
          id: staffId,
        },

        include: {
          services: {
            include: {
              service: true,
            },
          },

          availability: true,

          leaves: true,
        },
      });
    });

    return {
      success: true,

      data: updated,

      message: "Staff updated successfully",
    };
  } catch (error: any) {
    console.error("UPDATE STAFF ERROR:", error);

    return {
      success: false,

      error: error.message || "Failed to update staff",
    };
  }
}

export async function createStaffLeave(data: {
  staffId: string;
  startDate: string;
  endDate?: string;
  reason?: string;
}) {
  try {
    const leave = await prisma.staffLeave.create({
      data: {
        staffId: data.staffId,

        startDate: new Date(data.startDate),

        endDate: data.endDate ? new Date(data.endDate) : null,

        reason: data.reason?.trim() || null,
      },
    });

    return {
      success: true,
      data: leave,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// ============================================================================
// DELETE STAFF
// ============================================================================

export async function deleteStaff(staffId: string) {
  try {
    if (!staffId) {
      throw new Error("Staff ID is required");
    }

    const existingStaff = await prisma.staff.findUnique({
      where: {
        id: staffId,
      },
    });

    if (!existingStaff) {
      throw new Error("Staff not found");
    }

    // ================= DELETE RELATIONS =================

    await prisma.staffService.deleteMany({
      where: {
        staffId,
      },
    });

    await prisma.staffAvailability.deleteMany({
      where: {
        staffId,
      },
    });

    await prisma.staffLeave.deleteMany({
      where: {
        staffId,
      },
    });

    // ================= DELETE STAFF =================

    await prisma.staff.delete({
      where: {
        id: staffId,
      },
    });

    return {
      success: true,

      message: "Staff deleted successfully",
    };
  } catch (error: any) {
    console.error("DELETE STAFF ERROR:", error);

    return {
      success: false,

      error: error.message || "Failed to delete staff",
    };
  }
}
