import { z } from 'zod';

export const RegisterUserSchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string(),
  avatarURL: z.string().optional().nullable(),
  password: z.string(),
});

export const LoginUserSchema = z.object({
  identifier: z
    .string()
    .max(255)
    .openapi({ description: 'identifier: email | username' }),
  password: z.string().min(1).max(255),
});
