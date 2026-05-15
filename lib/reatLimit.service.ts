import { prisma } from "./prisma";

type CheckOtpRateLimitParams = {
  ip: string;
  email: string;
};

const EMAIL_COOLDOWN = 120 * 1000; // 2 min
const EMAIL_MAX = 5;
const EMAIL_WINDOW = 60 * 60 * 1000; // 1 hour

const IP_COOLDOWN = 120 * 1000; // 2 min
const IP_MAX = 10;
const IP_WINDOW = 60 * 60 * 1000; // 1 hour

export async function checkOtpRateLimit({
  ip,
  email,
}: CheckOtpRateLimitParams) {
  const now = new Date();
  const nowMs = now.getTime();

  // 🔹 Get user + IP record in parallel
  const [user, ipRecord] = await Promise.all([
    prisma.user.findUnique({
      where: { email },
      select: {
        email: true,
        otpAttempts: true,
        otpLastSentAt: true,
      },
    }),
    prisma.otpRateLimit.findUnique({
      where: { ip },
    }),
  ]);

  if (!user) {
    // avoid leaking info
    throw new Error("If the account exists, an OTP will be sent.");
  }

  // =========================
  // 1. EMAIL LIMIT (PRIMARY)
  // =========================

  if (user.otpLastSentAt) {
    const diff = nowMs - new Date(user.otpLastSentAt).getTime();

    // cooldown
    if (diff < EMAIL_COOLDOWN) {
      const wait = Math.ceil((EMAIL_COOLDOWN - diff) / 1000);
      throw new Error(`Please wait ${wait}s before requesting another OTP`);
    }

    // reset window
    if (diff > EMAIL_WINDOW) {
      await prisma.user.update({
        where: { email },
        data: {
          otpAttempts: 0,
        },
      });

      user.otpAttempts = 0; // keep local state in sync
    }
  }

  if (user.otpAttempts >= EMAIL_MAX) {
    throw new Error("Too many OTP requests. Try again later.");
  }

  // =========================
  // 2. IP LIMIT (SECONDARY)
  // =========================

  if (ipRecord) {
    const sinceLast = nowMs - new Date(ipRecord.lastHit).getTime();
    const sinceFirst = nowMs - new Date(ipRecord.firstHit).getTime();

    // cooldown
    if (sinceLast < IP_COOLDOWN) {
      const wait = Math.ceil((IP_COOLDOWN - sinceLast) / 1000);
      throw new Error(`Too many requests. Wait ${wait}s`);
    }

    // reset window
    if (sinceFirst > IP_WINDOW) {
      await prisma.otpRateLimit.update({
        where: { ip },
        data: {
          count: 0,
          firstHit: now,
          lastHit: now,
        },
      });

      ipRecord.count = 0; // sync local
    }

    if (ipRecord.count >= IP_MAX) {
      throw new Error("Too many requests from this network.");
    }
  }

  // =========================
  // 3. PASS → UPDATE BOTH
  // =========================

  await prisma.$transaction([
    prisma.user.update({
      where: { email },
      data: {
        otpAttempts: { increment: 1 },
        otpLastSentAt: now,
      },
    }),

    prisma.otpRateLimit.upsert({
      where: { ip },
      update: {
        count: { increment: 1 },
        lastHit: now,
      },
      create: {
        ip,
        count: 1,
        firstHit: now,
        lastHit: now,
        email, // optional, for analytics
      },
    }),
  ]);
}
