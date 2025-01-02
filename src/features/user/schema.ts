import { z } from 'zod';
import { UserSchema } from '../../../prisma/generated/zod';

export const GetUsersSchema = z.object({
  count: z.number(),
  users: UserSchema.array(),
});

export const GetUserByUsernameRequestSchema = z.object({
  param: z
    .string()
    .max(255)
    .openapi({ description: 'param: username | id | email' }),
});

export const GetUserByUsernameSchema = UserSchema;
