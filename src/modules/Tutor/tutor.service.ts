import { prisma } from "../../lib/prisma";

const createTutorIntoDB = async (
  payload: {
    bio?: string;
    experience?: number;
    hourlyRate?: number;
    education?: string;
  },
  userId: string,
) => {
  console.log("hit");
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  console.log(user);
  if (!user) {
    throw new Error("User not found");
  }

  const result = await prisma.tutorProfile.create({
    data: { ...payload, userId: user.id },
    include: { user: true },
  });
  return result;
};

// get all tutor

const getAllTutor = async () => {
  const tutors = await prisma.tutorProfile.findMany();
  return tutors;
};

export const TutorService = {
  // Add service methods here
  createTutorIntoDB,
  getAllTutor,
};
