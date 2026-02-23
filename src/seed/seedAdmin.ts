import bcrypt from "bcrypt";
import { UserRole } from "../middlewares/auth";
import { prisma } from "../lib/prisma";
const seedAdmin = async () => {
  const hashpassword = await bcrypt.hash("admin123", 8);

  const adminData = {
    name: "Admin",
    email: "admin@gmail.com",
    password: hashpassword,
    role: UserRole.admin,
  };

  try {
    const isExist = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });
    if (isExist) {
      console.log("Admin already exists");
      return;
    }
    if (!isExist) {
      await prisma.user.create({
        data: adminData,
      });
      console.log("Admin created successfully!");
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    await prisma.$disconnect();
  }
};

seedAdmin();
