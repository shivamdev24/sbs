import * as jose from "jose";
import { CONFIG } from "@/lib/costant/config";

// jose needs Uint8Array
const accessSecret = new TextEncoder().encode(CONFIG.ACCESS_TOKEN_SECRET);
const refreshSecret = new TextEncoder().encode(CONFIG.REFRESH_TOKEN_SECRET);

type SignTokenParams = {
  payload: Record<string, unknown>;
  secret: Uint8Array;
  expiresIn: string; // e.g. "1d", "7d"
};

export const signToken = async ({
  payload,
  secret,
  expiresIn,
}: SignTokenParams): Promise<string> => {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
};

export const generateAccessToken = async (data: Record<string, unknown>) => {
  return signToken({
    payload: data,
    secret: accessSecret,
    expiresIn: "15min",
  });
};

export const generateRefreshToken = async (userId: string) => {
  return signToken({
    payload: { id: userId },
    secret: refreshSecret,
    expiresIn: "7d",
  });
};

export const verifyAccessToken = async (token: string) => {
  try {
    const { payload } = await jose.jwtVerify(token, accessSecret);
    return payload;
  } catch (error) {
    if (error instanceof jose.errors.JWTExpired) {
      return { error: "Token expired" };
    }
    return { error: "Invalid token" };
  }
};

export const verifyRefreshToken = async (token: string) => {
  try {
    const { payload } = await jose.jwtVerify(token, refreshSecret);
    return payload;
  } catch (error) {
    if (error instanceof jose.errors.JWTExpired) {
      return { error: "Token expired" };
    }
    return { error: "Invalid token" };
  }
};
