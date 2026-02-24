import express from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { TutorController } from "./tutor.controller";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.tutor, UserRole.admin),
  TutorController.createTutorProfile,
);
router.get("/", TutorController.getAllTutors);

export const TutorRoutes = router;
