import bcrypt from "bcryptjs";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
export const hashOtp = async (otp: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const otphash = await bcrypt.hash(otp, salt);
  return otphash;
};

export const compareOtp = async (
  otp: string,
  hash: string,
): Promise<boolean> => {
  return await bcrypt.compare(otp, hash);
};

// Store hash in your password DB
