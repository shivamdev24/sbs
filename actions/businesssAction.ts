
/* eslint-disable react-hooks/rules-of-hooks */

"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from './getCurrentUser';




export async function createBusinessProfile(id: string) {


  if (!id) {
    // get user data from useAuthStore
     const user = await getCurrentUser();
     if (!user || typeof user === "string") {
       throw new Error("Invalid user data");
     }
  
     console.log("Current User:", user); // Debugging log
  
    // const AdminId = user?.id;
  
    
    console.log("Admin ID:", user.id); // Debugging log
    const BusinessProfileData = await prisma.businessProfile.create({
      data: {
        ownerId: user.id,
      },
    });
    console.log("Business Profile created without id:", BusinessProfileData); // Debugging log

    return {
      success: true,
      BusinessProfileData,
    };
  }


  
   const BusinessProfileData = await prisma.businessProfile.create({
     data: {
       ownerId: id,
     },
   });

   console.log("Business Profile created with id:", BusinessProfileData); // Debugging log


  

  return {
    success: true,
    BusinessProfileData,
  };
}



export async function getBusinessProfile() {


  const user = await getCurrentUser();

  console.log("Current User:", user); // Debugging log
  if (!user || typeof user === "string") {
    throw new Error("Invalid user data");
  }

  const id = user?.id;
  console.log("Admin ID:", id); // Debugging log
  
   const businessProfile = await prisma.businessProfile.findFirst({
    where: {
      ownerId:id,
    },
  });

   console.log("Business Profile found ", businessProfile); // Debugging log


  

  return {
    success: true,
    businessProfile,
  };
}
