import prisma from '@/lib/db';
import { User } from '@prisma/generated/zod';

export const getAllUsers = async (): Promise<User[]> => {
  return await prisma.user.findMany();
};

export const getUserByParam = async (param: string): Promise<User | null> => {
  return await prisma.user.findFirst({
    where: {
      OR: [{ id: param }, { email: param }, { username: param }],
    },
    include: {
      places: true,
      menuItems: true,
      menuItemReview: true,
    },
  });
};
