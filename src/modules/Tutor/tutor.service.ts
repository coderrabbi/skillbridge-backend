import { prisma } from "../../lib/prisma";
import type { TutorProfileWhereInput } from "../../../generated/prisma/models";
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
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          isBanned: true,
        },
      },
    },
  });
  return result;
};

interface getTutorsQuery {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  experience?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

const getAllTutors = async (payload: getTutorsQuery) => {
  const {
    search,
    categoryId,
    minPrice,
    maxPrice,
    minRating,
    experience,
    sortBy = "createdAt",
    sortOrder = "desc",
    page = 1,
    limit = 10,
  } = payload;

  const skip = (page - 1) * limit;

  const where: any = {};

  // Search
  if (search) {
    where.OR = [
      {
        user: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        bio: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        education: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  // Price Filter
  if (minPrice || maxPrice) {
    where.hourlyRate = {};
    if (minPrice) where.hourlyRate.gte = Number(minPrice);
    if (maxPrice) where.hourlyRate.lte = Number(maxPrice);
  }

  // Experience Filter
  if (experience) {
    where.experience = {
      gte: Number(experience),
    };
  }

  // Category Filter
  if (categoryId) {
    where.categories = {
      some: {
        id: categoryId,
      },
    };
  }
  const tutors = await prisma.tutorProfile.findMany({
    where,
    include: {
      user: true,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: Number(limit),
  });

  // const result = await prisma.tutorProfile.findMany({
  //   take: limit,
  //   skip: skip,
  //   where: {
  //     AND: conditionApply,
  //   },
  //   orderBy: {
  //     [sortBy]: sortOrder,
  //   },
  // });
  const total = await prisma.tutorProfile.count({
    where,
  });
  return {
    data: tutors,
    count: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// get tutor by id
const getTutorById = async (id: string) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: {
      id,
    },
  });
  return tutor;
};

export const TutorService = {
  // Add service methods here
  createTutorIntoDB,
  getAllTutors,
  getTutorById,
};
