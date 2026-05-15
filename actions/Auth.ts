// "use server";

// import { prisma } from "@/lib/prisma";
// import { generateAccessToken, generateRefreshToken } from "@/lib/token";
// import { cookies } from "next/headers";

// interface LoginData {
//   email: string;
//   password: string;
// }

// export async function loginAction({ email, password }: LoginData) {
//   const cookieStore = await cookies();

//   if (!email || !password) {
//     return { error: "Missing fields" };
//   }

//   const user = await prisma.user.findUnique({ where: { email } });

//   console.log("User found full detail:", user); // Debugging log
//   if (!user)
//     return { success: false, message: "Invalid credentials", status: 401 };

//   //   const isValid = await bcrypt.compare(password, user.password);
//   //   if (!isValid)
//   //     return { success: false, message: "Invalid credentials", status: 401 };
//   if (password !== user.password)
//     return { success: false, message: "Invalid credentials", status: 401 };

//   // Generate JWT token
//   const tokenData = { id: user.id, email: user.email, role: user.role };
//   // const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!);

//   const accesstoken = generateAccessToken(tokenData);

//   console.log("Generated Access Token:", accesstoken); // Debugging log
//   const refreshtoken = generateRefreshToken(user.id);

//   console.log("Generated Refresh Token:", refreshtoken); // Debugging log

//   // Set cookie
//   cookieStore.set("accesstoken", accesstoken, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     path: "/",
//     maxAge: 60 * 60 * 24, // 1 day
//   });

//   cookieStore.set("refreshtoken", refreshtoken, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     path: "/",
//     maxAge: 60 * 60 * 24 * 7, // 7 days
//   });

//   return {
//     success: true,
//     user: {
//       id: user.id,
//       email: user.email,
//       role: user.role,
//     },
//     accessToken: String(accesstoken),
//     refreshToken: String(refreshtoken),
//   };
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import {
  LoginService,
  otpSendService,
  OtpVerificationService,
  ResetPasswordService,
  signUpService,
} from "@/lib/auth.service";
import { headers } from "next/headers";

type SignupInput = {
  email: string;
  password: string;
};
type VerifyOtp = {
  email: string;
  otp: string;
};

type resetoptsend = {
  email: string;
};

export async function LoginAction(data: SignupInput) {
  try {
    const { email, password } = data;

    // 🔹 Validation
    if (!email || !password) {
      return {
        success: false,
        message: "Email and password are required",
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        message: "Password must be at least 6 characters",
      };
    }

    // 🔹 Call service
    const res = await LoginService(data);

    console.log("res by login action : - ", res);

    return {
      success: true,
      message: "Logged In successfully",
      res,
    };
  } catch (error: any) {
    console.error("Signup error:", error);

    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}
export async function signupAction(data: SignupInput) {
  try {
    const { email, password } = data;

    // 🔹 Validation
    if (!email || !password) {
      return {
        success: false,
        message: "Email and password are required",
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        message: "Password must be at least 6 characters",
      };
    }

    // 🔹 Call service
    const result = await signUpService(data);

    return {
      success: true,
      message: "Account Created successfully",
      data: result,
    };
  } catch (error: any) {
    console.error("Signup error:", error);

    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}
export async function sendotpAction(data: resetoptsend) {
  try {
    const ip =
      (await headers()).get("x-forwarded-for")?.split(",")[0] ||
      (await headers()).get("x-real-ip") ||
      "unknown";

    console.log("ip", ip);
    const { email } = data;

    // 🔹 Validation
    if (!email) {
      return {
        success: false,
        message: "Email and password are required",
      };
    }

    // 🔹 Call service
    const result = await otpSendService({ email, ip });

    return {
      success: true,
      message: "OTP Sent successfully",
      data: result,
    };
  } catch (error: any) {
    console.error("Otp error:", error);

    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}
export async function VerifyOtpAction(data: VerifyOtp) {
  try {
    const { email } = data;

    // 🔹 Validation
    if (!email) {
      return {
        success: false,
        message: "Email and password are required",
      };
    }

    // 🔹 Call service
    const result = await OtpVerificationService(data);

    return {
      success: true,
      message: "OTP Sent successfully",
      data: result,
    };
  } catch (error: any) {
    console.error("Otp error:", error);

    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}

export async function ResetAction(data: SignupInput) {
  try {
    const { email, password } = data;

    // 🔹 Validation
    if (!email || !password) {
      return {
        success: false,
        message: "Email and password are required",
      };
    }

    // 🔹 Call service
    const result = await ResetPasswordService(data);

    return {
      success: true,
      message: "New Password Set successfully",
      data: result,
    };
  } catch (error: any) {
    console.error("Password error:", error);

    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}
