import { Request, Response } from "express";
import { AuthService } from "./auth.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.createUserIntoDB(req.body);
    
  } catch (error) {}
};

export const AuthController = {
  // Add controller methods here
};
