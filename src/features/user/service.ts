import { User } from '../../../prisma/generated/zod';
import prisma from '../../lib/db';

export const getAllUsers = async (): Promise<{
  users: User[];
  count: number;
}> => {
  const users = await prisma.user.findMany();
  const count = await prisma.user.count();

  return { users, count };
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
