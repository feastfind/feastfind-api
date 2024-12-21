import { z } from 'zod';

export const RegisterUserSchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string(),
  avatarURL: z.string().optional().nullable(),
  password: z.string(),
});

export const LoginUserSchema = z.object({
  email: z.string().min(1).max(255),
  password: z.string().min(1).max(255),
});
