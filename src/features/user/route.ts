import { OpenAPIHono } from '@hono/zod-openapi';
import { API_TAGS } from '../../config/config';
import { handleErrorResponse } from '../../utils/handleError';
import {
  GetUserBySlugRequestSchema,
  GetUserBySlugSchema,
  GetUsersSchema,
} from './schema';
import { getAllUsers, getUserByParam } from './service';

const usersRoute = new OpenAPIHono();

usersRoute.openapi(
  {
    method: 'get',
    path: '/',
    description: 'Get all users without pagination',
    tags: API_TAGS.USER,
    responses: {
      200: {
        description: 'Get all users',
        content: { 'application/json': { schema: GetUsersSchema } },
      },
      500: { description: 'Failed to get all users' },
    },
  },
  async (c) => {
    try {
      const { users, count } = await getAllUsers();

      return c.json(
        {
          count,
          users,
        },
        200
      );
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
    tags: API_TAGS.USER,
    request: {
      params: GetUserBySlugRequestSchema,
    },
    responses: {
      200: {
        description: 'User retrieved successfully',
        content: { 'application/json': { schema: GetUserBySlugSchema } },
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
