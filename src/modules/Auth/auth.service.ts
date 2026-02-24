import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import jwt from "jsonwebtoken";

//*** create user *****

const createUserIntoDB = async (payload: any) => {
  const hashPassword = await bcrypt.hash(payload.password, 8);

  const result = await prisma.user.create({
    data: { ...payload, password: hashPassword },
  });

  const { password, ...newResult } = result;
  return newResult;
};

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
  if (!user) {
    throw new Error("User not find");
  }
  const isPasswordMatch = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordMatch) {
    throw new Error("Invalid credentials!!");
  }
  const userInfo = {
    id: user.id,
    name: user.name,
    role: user.role,
    isActive: user.isActive,
    email: user.email,
  };
  const { password, ...userData } = user;

  const token = await jwt.sign(userInfo, process.env.JWT_SECRET_KEY as string, {
    expiresIn: "1d",
  });
  return {
    token,
    userData,
  };
};

export const AuthService = {
  createUserIntoDB,
  loginUserIntoDB,
};
