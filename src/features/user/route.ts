import { OpenAPIHono, z } from '@hono/zod-openapi';
import { UserSchema } from '../../../prisma/generated/zod';
import { handleErrorResponse } from '../../utils/handleError';
import { getAllUsers, getUserByParam } from './service';

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
    path: '/{param}',
    description: 'Get a user by param.',
    tags: API_TAGS,
    request: {
      params: z.object({
        param: z
          .string()
          .max(255)
          .openapi({ description: 'param: username | id | email' }),
      }),
    },
    responses: {
      200: {
        description: 'User retrieved successfully',
        content: { 'application/json': { schema: UserSchema.array() } },
      },
      400: { description: 'Invalid param' },
      404: { description: 'User not found' },
      500: { description: 'Failed to get user' },
    },
  },
  async (c) => {
    try {
      const { param } = c.req.valid('param');

      const user = await getUserByParam(param);

      if (!user) return handleErrorResponse(c, 'User not found', 404);

      return c.json(user, 200);
    } catch (error) {
      return handleErrorResponse(c, `Failed to retrieve user: ${error}`, 500);
    }
  }
);

export { usersRoute };
