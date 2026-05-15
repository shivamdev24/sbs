/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // ✅ parse body
    const body = await req.json();
    const { categories, businessProfileId } = body;
    
    console.log(body)

    // ✅ validation
    if (!categories?.length || !businessProfileId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ create many
    const result = await prisma.category.createMany({
      data: categories.map((cat: { name: string }) => ({
        name: cat.name,
        businessProfileId,
      })),
      skipDuplicates: true,
    });

    // ✅ fetch only relevant categories (important fix)
    const fetchAllCat = await prisma.category.findMany({
      where: { businessProfileId },
    });

    console.log(fetchAllCat)

    return NextResponse.json({
      success: true,
      count: result.count,
      data: fetchAllCat,
    },
  { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}


// 🔹 Helper: consistent response
function success(data: any, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

function error(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

//
// ✅ GET: Fetch categories by businessProfileId
//
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const businessProfileId = searchParams.get("businessProfileId");

    if (!businessProfileId) {
      return error("businessProfileId is required", 400);
    }

    const categories = await prisma.category.findMany({
      where: { businessProfileId }
    });

    return success(categories);
  } catch (err) {
    console.error("GET CATEGORY ERROR:", err);
    return error("Failed to fetch categories", 500);
  }
}