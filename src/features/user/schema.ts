import { UserSchema } from '@prisma/generated/zod';
import { z } from 'zod';

export const UserParam = z.object({
  username: z
    .string()
    .max(255)
    .openapi({ description: 'param: username | id | email' }),
});

export const GetUsers = UserSchema.array()

export const GetUserDetail = UserSchema;
