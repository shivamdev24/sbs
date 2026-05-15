


import jwt, { SignOptions } from "jsonwebtoken";



const CONFIG = {
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,
};


interface SignTokenParams {
  payload: object;
  secret: string;
  expiresIn: SignOptions["expiresIn"];
}

export const signToken = ({
  payload,
  secret,
  expiresIn,
}: SignTokenParams): string => {
  return jwt.sign(payload, secret, {
    expiresIn,
  });
};



export const generateAccessToken = (data: object): string =>
  signToken({
    payload: data,
    secret: CONFIG.ACCESS_TOKEN_SECRET,
    expiresIn: "1d",
  });

export const generateRefreshToken = (userId: string): string =>
  signToken({
    payload: { id: userId },
    secret:  CONFIG.REFRESH_TOKEN_SECRET,
    expiresIn: "7d",
  });



  export const verifyAccessToken = (token: string) => {
  try {
    const payload = jwt.verify(token, CONFIG.ACCESS_TOKEN_SECRET);
    return payload
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { error: "Token expired" };
    }
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    const payload = jwt.verify(token, CONFIG.REFRESH_TOKEN_SECRET);
    return payload
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
        return { error: "Token expired" };
  }
  }
};
