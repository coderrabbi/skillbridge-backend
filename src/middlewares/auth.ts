import e, { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";
export enum UserRole {
  student = "STUDENT",
  tutor = "TUTOR",
  admin = "ADMIN",
}

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new Error("Unauthorized!!");
      }
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY as string,
      ) as JwtPayload;
      const userData = await prisma.user.findUnique({
        where: {
          email: decodedToken.email,
        },
      });

      if (!userData) {
        throw new Error("Unauthorized!!");
      }
      if (!userData.isActive) {
        throw new Error("Unauthorized!!");
      }

      if (!roles.includes(userData.role as UserRole)) {
        throw new Error("Unauthorized!!");
      }
      req.user = decodedToken;
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: "Unauthorized!!" });
    }
  };
};

export default auth;
