import { prisma } from "@/lib/prisma";
import {
  compareOtp,
  comparePassword,
  hashOtp,
  hashPassword,
} from "@/lib/utils/hash";
import { generateOTP } from "@/lib/utils/otp";
import { checkOtpRateLimit } from "@/lib/reatLimit.service";
import { sendEmail } from "@/lib/utils/sendMail";
import { cookies } from "next/headers";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt/token";

type SignupInput = {
  email: string;
  password: string;
};
type resetoptsend = {
  email: string;
  ip: string;
};
type VerifyOtp = {
  email: string;
  otp: string;
};

export async function LoginService(data: SignupInput) {
  const cookieStore = await cookies();
  const { email, password } = data;

  // 1. Basic validation
  if (!email || !password) {
    throw new Error("Missing email or password");
  }

  // 2. Check user limit
  const existedUser = await prisma.user.findFirst({
    where: { email },
  });
  console.log("existedUser", existedUser);

  if (!existedUser) {
    throw new Error("User not found!");
  }

  // 4. Hash password (you MUST do this)
  const comparedPass = await comparePassword(password, existedUser.password);
  console.log("comparedPass", comparedPass);
  if (comparedPass != true) {
    return {
      message: "password is incorrect, Try Again!",
      status: 400,
    };
  }

  const payloadtoken = {
    id: existedUser.id,
    role: existedUser.role,
    verified: existedUser.verified,
  };

  // 6. Generate token
  const accesstoken = await generateAccessToken({ payloadtoken });
  const refreshtoken = await generateRefreshToken(existedUser.id);

  // 7. Set cookie (depends on your setup)

  cookieStore.set("accesstoken", accesstoken, {
    httpOnly: true,
    secure: true,
  });

  cookieStore.set("refreshtoken", refreshtoken, {
    httpOnly: true,
    secure: true,
  });
  const payloadData = {
    accesstoken: accesstoken,
    RefreshToken: refreshtoken,
    User: existedUser,
  };
  console.log("user created", payloadData);

  return existedUser;
}

// export async function signUpService(data: SignupInput) {
//   const cookieStore = await cookies();
//   const { email, password } = data;

//   // 1. Basic validation
//   if (!email || !password) {
//     throw new Error("Missing email or password");
//   }

//   // 2. Check user limit
//   const count = await prisma.user.count({
//     where: { role: "USER" },
//   });

//   if (count >= 1) {
//     throw new Error("User slots full (max 1 users allowed)");
//   }

//   // 3. Check existing user
//   const existing = await prisma.user.findUnique({
//     where: { email },
//   });

//   if (existing) {
//     throw new Error("User already exists");
//   }

//   // 4. Hash password (you MUST do this)
//   const hashedPassword = await hashPassword(password);

//   // 5. Create user
//   const user = await prisma.user.create({
//     data: {
//       email,
//       password: hashedPassword,
//       verified: true,
//     },
//   });
//   const otp = generateOTP();

//   // 📩 send email
//   await sendEmail({
//     email,
//     emailType: "LOGIN MAIL",
//     otp,
//   });

//   const userId = user.id;

//   // 6. Generate token
//   const accesstoken = await generateAccessToken({ userId });
//   const refreshtoken = await generateRefreshToken(userId);

//   // 7. Set cookie (depends on your setup)

//   cookieStore.set("accesstoken", accesstoken, {
//     httpOnly: true,
//     secure: true,
//   });

//   cookieStore.set("refreshtoken", refreshtoken, {
//     httpOnly: true,
//     secure: true,
//   });
//   const payloadData = {
//     accesstoken,
//     refreshtoken,
//     user,
//   };
//   console.log("user created", payloadData);

//   return user;
// }

export async function signUpService(data: SignupInput) {
  // const cookieStore = await cookies();
  const { email, password } = data;

  if (!email || !password) {
    throw new Error("Missing email or password");
  }

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(password);

  // ✅ Create user (verified directly)
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      verified: true,
    },
  });
  const business = await prisma.businessProfile.create({
    data: {
      ownerId: user.id,
    },
  });

  console.log("business", business);

  // 📩 Send welcome email (NO OTP)
  await sendEmail({
    email,
    emailType: "WELCOME", // reuse or rename this
  });

  // // 🔐 Generate tokens (optional: auto-login)
  // const accesstoken = await generateAccessToken({ userId: user.id });
  // const refreshtoken = await generateRefreshToken(user.id);

  // cookieStore.set("accesstoken", accesstoken, {
  //   httpOnly: true,
  //   secure: true,
  // });

  // cookieStore.set("refreshtoken", refreshtoken, {
  //   httpOnly: true,
  //   secure: true,
  // });

  return {
    user,
    business,
    message: "Account created successfully",
  };
}

export async function otpSendService(data: resetoptsend) {
  const { email, ip } = data;

  // 🔒 rate limit first
  const rt = await checkOtpRateLimit({ ip, email });

  console.log(" Rate Limit", rt);

  // 1. Basic validation
  if (!email) {
    throw new Error("Missing email");
  }

  // 3. Check existing user
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (!existing) {
    throw new Error("Email not Found!");
  }

  // 4. Hash password (you MUST do this)

  const otp = generateOTP();
  const hashedOtp = await hashOtp(otp);

  // 5. Create user
  const user = await prisma.user.update({
    where: { email },
    data: {
      otp: hashedOtp,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    },
  });

  // 📩 send email
  await sendEmail({
    email,
    emailType: "RESET",
    otp,
  });

  return { success: true, user, message: "Otp Has Been Send to your mail" };
}

export async function OtpVerificationService(data: VerifyOtp) {
  const { email, otp } = data;

  if (!email || !otp) {
    return {
      success: false,
      message: "Email and OTP are required",
    };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return {
      success: false,
      message: "User not found",
    };
  }

  // 🔒 Check OTP exists
  if (!user.otp || !user.otpExpiry) {
    return {
      success: false,
      message: "No OTP found. Please request a new one.",
    };
  }

  // ⏳ Check expiry
  if (new Date() > user.otpExpiry) {
    return {
      success: false,
      message: "OTP expired",
    };
  }

  // 🔑 Compare OTP
  const isValid = await compareOtp(otp, user.otp);

  if (!isValid) {
    return {
      success: false,
      message: "Invalid OTP",
    };
  }

  // ✅ SUCCESS → clear OTP + mark verified
  await prisma.user.update({
    where: { email },
    data: {
      verified: true,
      emailVerifiedAt: new Date(),
      otp: null,
      otpExpiry: null,
      otpAttempts: 0,
    },
  });

  return {
    success: true,
    message: "OTP verified successfully",
  };
}
export async function ResetPasswordService(data: SignupInput) {
  const { email, password } = data;

  if (!email || !password) {
    throw new Error("Missing fields");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const hashedPassword = await hashPassword(password);

  await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
    },
  });

  return {
    success: true,
    message: "Password reset successful",
  };
}
