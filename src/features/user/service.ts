import { User } from '../../../prisma/generated/zod';
import prisma from '../../lib/db';

export const getAllUsers = async (): Promise<User[]> => {
  return await prisma.user.findMany();
}

export const getUserByUsername = async (username: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: {
      username,
    },
  })
}