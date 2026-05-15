// /* eslint-disable @typescript-eslint/no-explicit-any */

// import {
//   generateAccessToken,
//   generateRefreshToken,
// } from "@/lib/token";
// import { verifyRefreshToken } from "@/lib/token";
// import { prisma } from "./prisma";



// export async function refreshTokenAuth(refreshToken: any) {


//   const token = verifyRefreshToken(refreshToken);
//   console.log("Verified token:", token);

//   if (!token || typeof token === "string") {
//     throw new Error("Invalid refresh token");
//   }

//   // 1. Find user by refresh token existence
//   const user = await prisma.user.findUnique({
//     where: { id: token.id }
//   });

//   if (!user || !user.refreshToken) {
//     throw new Error("Refresh token invalid");
//   }

  


//   // 3. Rotate tokens
//   const newAccessToken = generateAccessToken(user?.id.toString());
//   const newRefreshToken = generateRefreshToken(user?.id.toString());

 

//   user.refreshToken = newRefreshToken;
//   user.refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

//   await user.save();

//   // 4. Set cookies

//     // 4. Set cookies
   

  

//   return { accessToken: newAccessToken,  newRefreshToken };
// }