import { z } from 'zod';
import { UserSchema } from '../../../prisma/generated/zod';

export const RegisterUserRequestSchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string(),
  avatarURL: z.string().optional().nullable(),
  password: z.string(),
});

export const RegisterUserSchema = UserSchema;

export const LoginUserRequestSchema = z.object({
  identifier: z
    .string()
    .max(255)
    .openapi({ description: 'identifier: email | username' }),
  password: z.string().min(1).max(255),
});

export const LoginUserSchema = UserSchema;
