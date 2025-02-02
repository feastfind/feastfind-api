import prisma from '@/lib/db';
import { User } from '@prisma/generated/zod';

export const getAllUsers = async (): Promise<User[]> => {
  return await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getUserByParam = async (param: string): Promise<User | null> => {
  return await prisma.user.findFirst({
    where: {
      OR: [{ id: param }, { email: param }, { username: param }],
    },
    include: {
      places: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      menuItems: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      menuItemReview: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });
};
