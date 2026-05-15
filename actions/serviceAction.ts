/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */

"use server";

import { prisma } from "@/lib/prisma";

// ===== TYPES =====
interface ServiceVariant {
  name: string;
  price: number;
  totalDuration?: number | null;
}

interface VariantInput {
  id?: string;
  name: string;
  price: number;
  totalDuration?: number | null;
}

interface CreateServiceData {
  name: string;
  categoryId: string;
  businessProfileId: string;
  variants: ServiceVariant[];
}

// ===== CREATE SERVICE =====
export async function createService(data: CreateServiceData) {
  try {
    const { name, categoryId, businessProfileId, variants } = data;

    // 🔹 Validation
    if (!name || !categoryId || !businessProfileId) {
      throw new Error(
        "Missing required fields: name, categoryId, businessProfileId",
      );
    }

    if (!variants || variants.length === 0) {
      throw new Error("At least one variant is required");
    }

    // 🔹 Verify category exists and belongs to this business
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    if (category.businessProfileId !== businessProfileId) {
      throw new Error("Category does not belong to this business");
    }

    // 🔹 Create service with variants
    const service = await prisma.service.create({
      data: {
        name: name.trim(),
        categoryId,
        businessProfileId,
        isActive: true, // ✅ Only active
        variants: {
          create: variants.map((v) => {
            const variant: any = {
              name: v.name.trim(),
              price: Number(v.price),
            };
            if (v.totalDuration !== null && v.totalDuration !== undefined) {
              variant.totalDuration = v.totalDuration;
            }
            return variant;
          }),
        },
      },
      include: {
        category: true,
        variants: true,
      },
    });

    console.log("Service created:", service);

    return {
      success: true,
      data: service,
      message: `Service "${service.name}" created with ${variants.length} variant(s)`,
    };
  } catch (error: any) {
    console.error("Error creating service:", error);
    return {
      success: false,
      error: error.message || "Failed to create service",
    };
  }
}

// ===== GET SERVICES =====
export async function getServices(businessProfileId: string) {
  try {
    if (!businessProfileId) {
      throw new Error("Business profile ID is required");
    }

    const services = await prisma.service.findMany({
      where: {
        businessProfileId,
      },
      include: {
        category: {
          select: { id: true, name: true },
        },
        variants: {
          select: { id: true, name: true, price: true, totalDuration: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: services,
      count: services.length,
    };
  } catch (error: any) {
    console.error("Error fetching services:", error);
    return {
      success: false,
      data: [],
      count: 0,
      error: error.message || "Failed to fetch services",
    };
  }
}

// ===== GET SERVICE BY ID =====
export async function getServiceById(serviceId: string) {
  try {
    if (!serviceId) {
      throw new Error("Service ID is required");
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        category: true,
        variants: true,
      },
    });

    if (!service) {
      throw new Error("Service not found");
    }

    return {
      success: true,
      data: service,
    };
  } catch (error: any) {
    console.error("Error fetching service:", error);
    return {
      success: false,
      data: null,
      error: error.message || "Failed to fetch service",
    };
  }
}

// ===== UPDATE SERVICE =====
export async function updateService(
  serviceId: string,
  data: {
    name?: string;
    categoryId?: string;
    isActive?: boolean;
  },
) {
  try {
    if (!serviceId) {
      throw new Error("Service ID is required");
    }

    // Verify service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      throw new Error("Service not found");
    }

    // Update service
    const updated = await prisma.service.update({
      where: { id: serviceId },
      data: {
        ...(data.name && { name: data.name.trim() }),
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
      include: {
        category: true,
        variants: true,
      },
    });

    return {
      success: true,
      data: updated,
      message: "Service updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating service:", error);
    return {
      success: false,
      error: error.message || "Failed to update service",
    };
  }
}
// ===== UPDATE SERVICE variants =====
export async function updateServicevariants(
  serviceId: string,
  data: {
    name?: string;
    categoryId?: string;
    isActive?: boolean;
    variants?: VariantInput[];
  },
) {
  try {
    if (!serviceId) {
      throw new Error("Service ID is required");
    }

    const existingService = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        variants: true,
      },
    });

    if (!existingService) {
      throw new Error("Service not found");
    }

    const updated = await prisma.$transaction(async (tx) => {
      // ================= UPDATE SERVICE =================

      await tx.service.update({
        where: { id: serviceId },

        data: {
          ...(data.name && {
            name: data.name.trim(),
          }),

          ...(data.categoryId && {
            categoryId: data.categoryId,
          }),

          ...(data.isActive !== undefined && {
            isActive: data.isActive,
          }),
        },
      });

      // ================= UPDATE / CREATE VARIANTS =================

      if (data.variants) {
        for (const variant of data.variants) {
          // EXISTING VARIANT -> UPDATE
          if (variant.id) {
            console.log("Updating variant:", variant);
            await tx.serviceVariant.update({
              where: {
                id: variant.id,
              },

              data: {
                name: variant.name.trim(),
                price: Number(variant.price),
                totalDuration: Number(variant.totalDuration || 0),
              },
            });
          }

          // NEW VARIANT -> CREATE
          else {
            await tx.serviceVariant.create({
             

              data: {

                serviceId,
                name: variant.name.trim(),

                price: Number(variant.price),

                totalDuration: Number(variant.totalDuration || 0),
              },
            });
          }
        }
      }

      // ================= RETURN FRESH DATA =================

      return await tx.service.findUnique({
        where: { id: serviceId },

        include: {
          category: true,
          variants: true,
        },
      });
    });

    return {
      success: true,
      data: updated,
      message: "Service updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating service:", error);

    return {
      success: false,
      error: error.message || "Failed to update service",
    };
  }
}

// ===== DELETE SERVICE =====
export async function deleteService(serviceId: string) {
  try {
    if (!serviceId) {
      throw new Error("Service ID is required");
    }

    // Verify service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      throw new Error("Service not found");
    }

    // 1. Delete package links
    await prisma.packageItem.deleteMany({
      where: { serviceId },
    });

    // 2. Delete booking items (⚠️ destructive)
    await prisma.bookingItem.deleteMany({
      where: { serviceId },
    });

    // 3. Delete variants
    await prisma.serviceVariant.deleteMany({
      where: { serviceId },
    });

    // 4. Delete service
    const deleted = await prisma.service.delete({
      where: { id: serviceId },
    });

    console.log("Service deleted:", deleted);

    return {
      success: true,
      data: deleted,
      message: `Service deleted successfully`,
    };
  } catch (error: any) {
    // Handle specific Prisma errors
    if (error.code === "P2025") {
      return {
        success: false,
        error: "Service not found",
      };
    }

    if (error.code === "P2003") {
      return {
        success: false,
        error:
          "Cannot delete service because it's in use. Remove it from packages and bookings first.",
      };
    }

    console.error("Error deleting service:", error);
    return {
      success: false,
      error: error.message || "Failed to delete service",
    };
  }
}

// ===== GET SERVICES BY CATEGORY =====
export async function getServicesByCategory(
  businessProfileId: string,
  categoryId: string,
) {
  try {
    if (!businessProfileId || !categoryId) {
      throw new Error("Business ID and Category ID are required");
    }

    const services = await prisma.service.findMany({
      where: {
        businessProfileId,
        categoryId,
      },
      include: {
        category: true,
        variants: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: services,
      count: services.length,
    };
  } catch (error: any) {
    console.error("Error fetching services by category:", error);
    return {
      success: false,
      data: [],
      count: 0,
      error: error.message || "Failed to fetch services",
    };
  }
}
