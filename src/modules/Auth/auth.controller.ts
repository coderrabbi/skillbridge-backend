import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.createUserIntoDB(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "user created successfully",
      data: result,
    });
  } catch (error) {
    throw new Error("something went worng");
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.loginUserIntoDB(req.body);
    res.cookie("token", result.token, {
      secure: false,
      httpOnly: true,
      sameSite: "strict", // none / strict / lax
    });
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "user login successfully",
      data: result,
    });
  } catch (error) {
    throw new Error("something went worng");
  }
};

export const AuthController = {
  // Add controller methods here
  createUser,
  loginUser,
};
