import type { Context } from 'hono';
import { OpenAPIHono, z } from '@hono/zod-openapi';
import prisma from '../../lib/db';
import { Prisma } from '@prisma/client';
import { UserSchema } from '../../../prisma/generated/zod';

const usersRoute = new OpenAPIHono();
const API_TAGS = ['User'];

usersRoute.openapi(
  {
    method: 'get',
    path: '/',
    description: 'Get all users without pagination',
    tags: API_TAGS,
    responses: {
      200: {
        description: 'Get all users',
        content: { 'application/json': { schema: UserSchema.array() } },
      },
      500: { description: 'Failed to get all users' },
    },
  },
  async (c) => {
    try {
      const users = await prisma.user.findMany();

      return c.json(users, 200);
    } catch (error:
      | Prisma.PrismaClientKnownRequestError
      | Prisma.PrismaClientUnknownRequestError
      | any) {
      return c.json({ error: error.message }, 500);
    }
  }
);

export { usersRoute };
