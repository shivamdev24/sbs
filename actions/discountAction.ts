// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react-hooks/rules-of-hooks */

// "use server";

// import { prisma } from "@/lib/prisma";

// // ===== TYPES =====
// interface CreateDiscountData {
//   code: string;
//   description?: string;
//   discountPercentage: number;
//   businessProfileId: string;
// }

// // ===== CREATE DISCOUNT =====
// export async function createDiscount(data: CreateDiscountData) {
//   try {
//     const { code, description, discountPercentage, businessProfileId } = data;

//     // 🔹 Validation
//     if (!code || !discountPercentage || !businessProfileId) {
//       throw new Error("Missing required fields");
//     }

//     if (discountPercentage <= 0 || discountPercentage > 100) {
//       throw new Error("Discount must be between 1 and 100");
//     }

//     // 🔹 Check duplicate code
//     const existing = await prisma.discountCode.findUnique({
//       where: { code },
//     });

//     if (existing) {
//       throw new Error("Discount code already exists");
//     }

//     // 🔹 Create discount
//     const discount = await prisma.discountCode.create({
//       data: {
//         code: code.trim().toUpperCase(),
//         description: description?.trim() || null,
//         discountPercentage: Number(discountPercentage),
//         businessProfileId,
//       },
//     });

//     return {
//       success: true,
//       data: discount,
//       message: `Discount "${discount.code}" created`,
//     };
//   } catch (error: any) {
//     console.error("Error creating discount:", error);
//     return {
//       success: false,
//       error: error.message || "Failed to create discount",
//     };
//   }
// }

// // ===== GET DISCOUNT =====
// export async function getDiscounts(businessProfileId: string) {
//   try {
//     if (!businessProfileId) {
//       throw new Error("Business profile ID is required");
//     }

//     const discounts = await prisma.discountCode.findMany({
//       where: { businessProfileId },
//       orderBy: { createdAt: "desc" },
//     });

//     return {
//       success: true,
//       data: discounts,
//       count: discounts.length,
//     };
//   } catch (error: any) {
//     console.error("Error fetching discounts:", error);
//     return {
//       success: false,
//       data: [],
//       count: 0,
//       error: error.message || "Failed to fetch discounts",
//     };
//   }
// }

// // ===== GET DISCOUNT BY CODE =====
// export async function getDiscountByCode(code: string) {
//   try {
//     if (!code) {
//       throw new Error("Code is required");
//     }

//     const discount = await prisma.discountCode.findUnique({
//       where: { code: code.toUpperCase() },
//     });

//     if (!discount) {
//       throw new Error("Invalid discount code");
//     }

//     return {
//       success: true,
//       data: discount,
//     };
//   } catch (error: any) {
//     return {
//       success: false,
//       data: null,
//       error: error.message || "Failed to fetch discount",
//     };
//   }
// }

// // ===== UPDATE DISCOUNT =====
// export async function updateDiscount(
//   id: string,
//   data: {
//     code?: string;
//     description?: string;
//     discountPercentage?: number;
//   }
// ) {
//   try {
//     if (!id) {
//       throw new Error("Discount ID is required");
//     }

//     const updated = await prisma.discountCode.update({
//       where: { id },
//       data: {
//         ...(data.code && { code: data.code.trim().toUpperCase() }),
//         ...(data.description && { description: data.description.trim() }),
//         ...(data.discountPercentage && {
//           discountPercentage: Number(data.discountPercentage),
//         }),
//       },
//     });

//     return {
//       success: true,
//       data: updated,
//       message: "Discount updated successfully",
//     };
//   } catch (error: any) {
//     return {
//       success: false,
//       error: error.message || "Failed to update discount",
//     };
//   }
// }

// // ===== DELETE DISCOUNT =====
// export async function deleteDiscount(id: string) {
//   try {
//     if (!id) {
//       throw new Error("Discount ID is required");
//     }

//     await prisma.discountCode.delete({
//       where: { id },
//     });

//     return {
//       success: true,
//       message: "Discount deleted successfully",
//     };
//   } catch (error: any) {
//     return {
//       success: false,
//       error: error.message || "Failed to delete discount",
//     };
//   }
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */

"use server";

import { prisma } from "@/lib/prisma";

// ===== TYPES =====

interface CreateDiscountData {
  code: string;
  description?: string;

  discountPercentage: number;

  businessProfileId: string;

  validFrom?: string | null;

  validUntil?: string | null;

  maxUses?: number | null;
}

// ===== CREATE DISCOUNT =====

export async function createDiscount(data: CreateDiscountData) {
  try {
    const {
      code,
      description,
      discountPercentage,
      businessProfileId,
      validFrom,
      validUntil,
      maxUses,
    } = data;

    // ================= VALIDATION =================

    if (!code || !discountPercentage || !businessProfileId) {
      throw new Error("Missing required fields");
    }

    if (discountPercentage <= 0 || discountPercentage > 100) {
      throw new Error("Discount must be between 1 and 100");
    }

    // ================= CHECK DUPLICATE =================

    const existing = await prisma.discountCode.findFirst({
      where: {
        code: code.toUpperCase(),
        businessProfileId,
      },
    });

    if (existing) {
      throw new Error("Discount code already exists");
    }

    // ================= CREATE =================

    const discount = await prisma.discountCode.create({
      data: {
        code: code.trim().toUpperCase(),

        description: description?.trim() || null,

        discountPercentage: Number(discountPercentage),

        businessProfileId,

        validFrom: validFrom ? new Date(validFrom) : null,

        validUntil: validUntil ? new Date(validUntil) : null,

        maxUses: maxUses || null,
      },
    });

    return {
      success: true,

      data: discount,

      message: `Discount "${discount.code}" created`,
    };
  } catch (error: any) {
    console.error("Error creating discount:", error);

    return {
      success: false,

      error: error.message || "Failed to create discount",
    };
  }
}

// ===== GET DISCOUNTS =====

export async function getDiscounts(businessProfileId: string) {
  try {
    if (!businessProfileId) {
      throw new Error("Business profile ID is required");
    }

    const discounts = await prisma.discountCode.findMany({
      where: {
        businessProfileId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,

      data: discounts,

      count: discounts.length,
    };
  } catch (error: any) {
    console.error("Error fetching discounts:", error);

    return {
      success: false,

      data: [],

      count: 0,

      error: error.message || "Failed to fetch discounts",
    };
  }
}

// ===== GET DISCOUNT BY CODE =====

export async function getDiscountByCode(code: string) {
  try {
    if (!code) {
      throw new Error("Code is required");
    }

    const discount = await prisma.discountCode.findFirst({
      where: {
        code: code.toUpperCase(),
      },
    });

    if (!discount) {
      throw new Error("Invalid discount code");
    }

    return {
      success: true,

      data: discount,
    };
  } catch (error: any) {
    return {
      success: false,

      data: null,

      error: error.message || "Failed to fetch discount",
    };
  }
}

// ===== UPDATE DISCOUNT =====

export async function updateDiscount(
  id: string,

  data: {
    code?: string;

    description?: string;

    discountPercentage?: number;

    validFrom?: string | null;

    validUntil?: string | null;

    maxUses?: number | null;
  },
) {
  try {
    if (!id) {
      throw new Error("Discount ID is required");
    }

    const updated = await prisma.discountCode.update({
      where: {
        id,
      },

      data: {
        ...(data.code && {
          code: data.code.trim().toUpperCase(),
        }),

        ...(data.description !== undefined && {
          description: data.description?.trim() || null,
        }),

        ...(data.discountPercentage !== undefined && {
          discountPercentage: Number(data.discountPercentage),
        }),

        ...(data.validFrom !== undefined && {
          validFrom: data.validFrom ? new Date(data.validFrom) : null,
        }),

        ...(data.validUntil !== undefined && {
          validUntil: data.validUntil ? new Date(data.validUntil) : null,
        }),

        ...(data.maxUses !== undefined && {
          maxUses: data.maxUses,
        }),
      },
    });

    return {
      success: true,

      data: updated,

      message: "Discount updated successfully",
    };
  } catch (error: any) {
    console.error(error);

    return {
      success: false,

      error: error.message || "Failed to update discount",
    };
  }
}

// ===== DELETE DISCOUNT =====

export async function deleteDiscount(id: string) {
  try {
    if (!id) {
      throw new Error("Discount ID is required");
    }

    await prisma.discountCode.delete({
      where: {
        id,
      },
    });

    return {
      success: true,

      message: "Discount deleted successfully",
    };
  } catch (error: any) {
    console.error(error);

    return {
      success: false,

      error: error.message || "Failed to delete discount",
    };
  }
}
