// import nodemailer from "nodemailer";

// interface SendEmailParams {
//   email: string;
//   emailType: "SIGNUP MAIL" | "LOGIN MAIL" | "RESET" | "SIGNUP BY ADMIN";
//   userId: string;
//   otp?: string;
// }

// const transport = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: Number(process.env.SMTP_PORT),
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// export const sendEmail = async ({
//   email,
//   emailType,
//   userId,
//   otp,
// }: SendEmailParams) => {
//   if (!userId) {
//     throw new Error("User ID is required");
//   }

//   try {
//     const subject =
//       emailType === "SIGNUP BY ADMIN" ||
//       emailType === "SIGNUP MAIL" ||
//       emailType === "LOGIN MAIL" ||
//       emailType === "RESET";

//     let htmlContent: string;
//     switch (emailType) {
//       case "SIGNUP MAIL":
//         htmlContent = `<p>Your signup OTP is <strong>${otp}</strong>. The expiry time for the OTP is 10 minutes.</p>`;
//         break;
//       case "LOGIN MAIL":
//         htmlContent = `<p>Your login OTP is <strong>${otp}</strong>. The expiry time for the OTP is 10 minutes.</p>`;
//         break;
//       case "RESET":
//         htmlContent = `<p>You requested to reset your password. Use the following code: <strong>${otp}</strong>. The expiry time for this code is 10 minutes.</p>`;
//         break;
//       case "SIGNUP BY ADMIN":
//         htmlContent = `<p>Your account has been created by an admin.</p>`;
//         break;
//       default:
//         throw new Error("Invalid email type");
//     }

//     const mailOptions = {
//       from: {
//         address: "owner@gmail.com",
//         name: "Epic Hair",
//       },
//       to: email,
//       subject,
//       html: htmlContent,
//     };

//     const mailResponse = await transport.sendMail(mailOptions);
//     console.log("Mail sent successfully:", mailResponse);
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw new Error(`Error sending email: ${error}`);
//   }
// };

import nodemailer from "nodemailer";
import { baseTemplate } from "./templates/templates";

interface SendEmailParams {
  email: string;
  emailType: "WELCOME" | "LOGIN" | "RESET";
  otp?: string;
}

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({ email, emailType, otp }: SendEmailParams) => {
  try {
    const test = { email, emailType, otp };

    console.log("data on send email", test);

    // 🧠 Subject
    let subject: string;

    switch (emailType) {
      case "WELCOME":
      case "LOGIN":
        subject = "Verify Your Email";
        break;
      case "RESET":
        subject = "Reset Your Password";
        break;
      default:
        subject = "Notification";
    }

    // 📨 Template content
    let html: string;

    const common = {
      logoUrl: process.env.LOGO_URL!,
      brandName: process.env.BRAND_NAME || "Epic Hair",
    };

    switch (emailType) {
      case "WELCOME":
        html = baseTemplate({
          ...common,
          title: "Welcome to Salon Booking System",
          message:
            "Your admin account has been created successfully. You can now access your dashboard and start managing your salon.",
          note: "For login credentials, please contact your administrator.",
          footerNote:
            "If you were not expecting this, please contact support immediately.",
        });
        break;
      case "LOGIN":
        html = baseTemplate({
          ...common,
          title: "Verify Your Email",
          message: "We received a request to sign in to your account.",
          otp,
          note: "",
          footerNote:
            "This code will expire in 10 minutes. If you didn’t request this, ignore this email.",
        });
        break;

      case "RESET":
        html = baseTemplate({
          ...common,
          title: "Reset Your Password",
          message: "We received a request to reset your password.",
          otp,
          note: "",
          footerNote:
            "This code will expire in 10 minutes. If you didn’t request this, ignore this email.",
        });
        break;

      default:
        throw new Error("Invalid email type");
    }

    const mailOptions = {
      from: {
        address: process.env.EMAIL_FROM!,
        name: process.env.BRAND_NAME || "Epic Hair",
      },
      to: email,
      subject,
      html,
    };

    const response = await transport.sendMail(mailOptions);
    console.log("Mail sent:", response.messageId);

    return true;
  } catch (error) {
    console.error("Email error:", error);
    throw error;
  }
};
