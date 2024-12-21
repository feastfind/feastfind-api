import { User } from '../../../prisma/generated/zod';
import prisma from '../../lib/db';

export const getAllUsers = async (): Promise<User[]> => {
  return await prisma.user.findMany();
};

export const getUserByParam = async (param: string): Promise<User | null> => {
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(param);
  const isCUID = /^[a-z0-9]{25}$/.test(param);

  if (isEmail) {
    return await prisma.user.findUnique({
      where: {
        email: param,
      },
      include: {
        places: true,
        menuItems: true,
        menuItemReview: true,
      },
    });
  }

  if (isCUID) {
    return await prisma.user.findUnique({
      where: {
        id: param,
      },
      include: {
        places: true,
        menuItems: true,
        menuItemReview: true,
      },
    });
  }

  return await prisma.user.findFirst({
    where: {
      OR: [{ username: param }, { email: param }, { id: param }],
    },
    include: {
      places: true,
      menuItems: true,
      menuItemReview: true,
    },
  });
};
