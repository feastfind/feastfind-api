import { OpenAPIHono, z } from '@hono/zod-openapi';
import { UserSchema } from '../../../prisma/generated/zod';
import { handleErrorResponse } from '../../utils/handleError';
import { getAllUsers, getUserByUsername } from './service';

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
      const users = await getAllUsers();

      return c.json(users, 200);
    } catch (error) {
      return handleErrorResponse(c, `Failed to get all users: ${error}`, 500);
    }
  }
);

usersRoute.openapi(
  {
    method: 'get',
    path: '/{username}',
    description: 'Get a user by username.',
    tags: API_TAGS,
    request: {
      params: z.object({ username: z.string().max(100) }),
    },
    responses: {
      200: {
        description: 'Get all users',
        content: { 'application/json': { schema: UserSchema.array() } },
      },
      400: { description: 'Invalid username' },
      404: { description: 'User not found' },
      500: { description: 'Failed to get user' },
    },
  },
  async (c) => {
    try {
      const { username } = c.req.valid('param');

      const user = await getUserByUsername(username);

      if (!user) return handleErrorResponse(c, 'User not found', 404);

      return c.json(user, 200);
    } catch (error) {
      return handleErrorResponse(c, `Failed to retrieve user: ${error}`, 500);
    }
  }
);

export { usersRoute };
