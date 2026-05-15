
// actions/logout.ts
"use server";


import { cookies } from "next/headers";



export async function logoutAction() {
 

  (await cookies()).delete("accesstoken");
  (await cookies()).delete("refreshtoken");
  // Clear other stores if needed

}