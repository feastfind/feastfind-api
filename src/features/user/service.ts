import { User } from '../../../prisma/generated/zod';
import prisma from '../../lib/db';
import { isValidCUID, isValidEmail } from '../../utils/regex';

export const getAllUsers = async (): Promise<User[]> => {
  return await prisma.user.findMany();
};

export const getUserByParam = async (param: string): Promise<User | null> => {
  const isEmail = isValidEmail(param);
  const isCUID = isValidCUID(param);

  return await prisma.user.findUnique({
    where: isEmail
      ? { email: param }
      : isCUID
        ? { id: param }
        : { username: param },
    include: {
      places: true,
      menuItems: true,
      menuItemReview: true,
    },
  });
};
