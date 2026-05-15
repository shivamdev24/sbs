/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */


"use server";

import { prisma } from "@/lib/prisma";





export async function createCategories(data: {
  categories: { name: string }[];
  businessProfileId: string;
}) {
  try {
    const { categories, businessProfileId } = data;

    if (!categories?.length || !businessProfileId) {
      throw new Error("Missing required fields");
    }

    const result = await prisma.category.createMany({
      data: categories.map((cat) => ({
        name: cat.name,
        businessProfileId
      })),
      skipDuplicates: true // 🔥 important
    });


    // ✅ CORRECT
const fetchAllCat = await prisma.category.findMany({
  where: {
    businessProfileId,  // ← Filter by business
  },
});

    console.log("all cat", fetchAllCat);

    return {
      success: true,
      count: result.count,
      fetchAllCat
    };

  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}



export async function getCategories(businessProfileId: string) {

   
  try {
    const categories = await prisma.category.findMany({
      where: {
        businessProfileId,
      },
    });

    return {
      success: true,
      data: categories,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}


export async function deleteCategory(catID: string) {
  try {
    // ✅ Validate input
    if (!catID || typeof catID !== "string" || catID.trim() === "") {
      return {
        success: false,
        error: "Invalid category ID",
      };
    }

    // ✅ Delete category and cascade to services
    const deletedCategory = await prisma.category.delete({
      where: {
        id: catID,
      },
    });

    return {
      success: true,
      data: deletedCategory,
      message: `Category "${deletedCategory.name}" deleted successfully`,
    };
  } catch (error: any) {
    // ✅ Handle specific Prisma errors
    if (error.code === "P2025") {
      return {
        success: false,
        error: "Category not found",
      };
    }

    if (error.code === "P2003") {
      return {
        success: false,
        error: "Cannot delete category because it has services. Delete services first.",
      };
    }

    console.error("Error deleting category:", error);
    return {
      success: false,
      error: error.message || "Failed to delete category",
    };
  }
}