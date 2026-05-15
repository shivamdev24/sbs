"use server";



import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/token";
import { prisma } from '@/lib/prisma';

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get("accesstoken")?.value;

  console.log("Access Token in getCurrentUser:", token);

  if (!token) return null;

  try {
    const decodedUser = verifyAccessToken(token);

    console.log("Decoded token:", decodedUser);

    return decodedUser;
  } catch {
    return null;
  }
}


// export async function getCurrentUserBusinessProfile() {
//   const cookieStore = await cookies();

//   const token = cookieStore.get("accesstoken")?.value;

//   console.log("Access Token in getCurrentUser:", token);

//   if (!token) return null;

//   try {
//     const decodedUser = verifyAccessToken(token);
// const id = decodedUser?.id;

// const BID = await prisma.businessProfile.findFirst(
//   id
// )

// console.log("BID", BID)

//     return BID;
//   } catch {
//     return null;
//   }
// }