import { User } from '../../../prisma/generated/zod';
import prisma from '../../lib/db';
import { hashPassword, verifyPassword } from '../../utils/password';
import { createToken } from '../../utils/token';

export const registerUser = async (
  name: string,
  username: string,
  email: string,
  avatarURL: string,
  password: string
): Promise<Partial<User>> => {
  const existingUsername = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (existingUsername) {
    throw new Error('User already exists');
  }

  const existingEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingEmail) {
    throw new Error('User already exists');
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await prisma.user.create({
    data: {
      name,
      username,
      email,
      avatarURL,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  return {
    id: newUser.id,
    name: newUser.name,
    username: newUser.username,
    email: newUser.email,
    avatarURL: newUser.avatarURL,
  };
};

export const loginUser = async (
  email: string,
  password: string
): Promise<{ token: string | null; user: Partial<User> }> => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      password: true,
    },
  });

  if (!user || !user.password) {
    throw new Error('Invalid email');
  }

  const isValidPassword = await verifyPassword(password, user.password.hash);

  if (!isValidPassword) {
    throw new Error('Invalid password');
  }

  const token = await createToken(user.id);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      avatarURL: user.avatarURL,
    },
  };
};
