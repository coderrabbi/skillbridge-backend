import { Request, Response } from "express";
import { TutorService } from "./tutor.service";
import sendResponse from "../../utils/sendResponse";

const createTutorProfile = async (req: Request, res: Response) => {
  try {
    const result = await TutorService.createTutorIntoDB(req.body, req.user?.id);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Tutor created successfully!!",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: (error as Error)?.message || "Something went wrong",
      data: null,
    });
  }
};
const getAllTutors = async (req: Request, res: Response) => {
  try {
    const result = await TutorService.getAllTutor();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All tutors retrieved successfully!!",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: (error as Error)?.message || "Something went wrong",
      data: null,
    });
  }
};

export const TutorController = {
  // Add controller methods here
  createTutorProfile,
  getAllTutors,
};
