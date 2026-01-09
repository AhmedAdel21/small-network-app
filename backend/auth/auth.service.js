import bcrypt from "bcryptjs";

const saltRounds = 12;
export const hashPassword = async (password) =>
  await bcrypt.hash(password, saltRounds);

export const comparePassword = async (password, hash) =>
  await bcrypt.compare(password, hash);
