import type { Context } from 'hono';
import { OpenAPIHono, z } from '@hono/zod-openapi';
import prisma from '../../lib/db';
import { Prisma } from '@prisma/client';

const usersRoute = new OpenAPIHono();
const API_TAGS = ['User'];

// Get Users Route
usersRoute.openapi(
  {
    method: 'get',
    path: '/',
    summary: 'Users',
    description: 'Get all users',
    tags: API_TAGS,
    responses: {
      200: { description: 'Get all users' },
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
