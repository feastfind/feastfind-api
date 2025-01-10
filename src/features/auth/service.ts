import prisma from '@/lib/db';
import { hashPassword, verifyPassword } from '@/utils/password';
import { createToken } from '@/utils/token';
import type { LoginUser, RegisterUser, User } from './schema';
import { getDiceBearAvatar, isValidEmail } from './utils';

export const registerUser = async ({
  name,
  username,
  email,
  password,
}: RegisterUser): Promise<Partial<User>> => {
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
  const avatarURL = getDiceBearAvatar(username, 64);

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

export const loginUser = async ({
  identifier,
  password,
}: LoginUser): Promise<{ token: string | null; user: Partial<User> }> => {
  const isEmail = isValidEmail(identifier);

  const user = await prisma.user.findUnique({
    where: isEmail ? { email: identifier } : { username: identifier },
    include: {
      password: true,
    },
  });

  if (!user) {
    throw new Error('Invalid email or username');
  }

  if (!user.password) {
    throw new Error('User does not have a password');
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
