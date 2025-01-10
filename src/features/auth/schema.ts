import { UserSchema } from '@prisma/generated/zod';
import { z } from 'zod';

export const User = UserSchema;
export type User = z.infer<typeof User>;

export const UserResponse = z.object({
  message: z.string(),
  user: User,
});

export const RegisterUser = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string(),
  password: z.string(),
});
export type RegisterUser = z.infer<typeof RegisterUser>;

export const LoginUser = z.object({
  identifier: z
    .string()
    .max(255)
    .openapi({ description: 'identifier: email | username' }),
  password: z.string().min(1).max(255),
});
export type LoginUser = z.infer<typeof LoginUser>;

export const LoginUserResponse = UserResponse.extend({
  token: z.string(),
});
