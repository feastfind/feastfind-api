import { OpenAPIHono } from '@hono/zod-openapi';
import { API_TAGS } from '../../config/config';
import { handleErrorResponse } from '../../utils/handleError';

import * as userSchema from '@user/schema';
import * as userService from '@user/service';

const usersRoute = new OpenAPIHono();

usersRoute.openapi(
  {
    method: 'get',
    path: '/',
    summary: 'Get all users',
    description: 'Get all users without pagination',
    tags: API_TAGS.USER,
    responses: {
      200: {
        description: 'Get all users',
        content: { 'application/json': { schema: userSchema.GetUsers } },
      },
      500: { description: 'Failed to get all users' },
    },
  },
  async (c) => {
    try {
      const users = await userService.getAllUsers();

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
    summary: 'Get user details',
    description: 'Get a user by username, email, or id.',
    tags: API_TAGS.USER,
    request: {
      params: userSchema.UserParam,
    },
    responses: {
      200: {
        description: 'User retrieved successfully',
        content: { 'application/json': { schema: userSchema.GetUserDetail } },
      },
      404: { description: 'User not found' },
      500: { description: 'Failed to get user' },
    },
  },
  async (c) => {
    try {
      const { username } = c.req.valid('param');

      const user = await userService.getUserByParam(username);

      if (!user) return handleErrorResponse(c, 'User not found', 404);

      return c.json(user, 200);
    } catch (error) {
      return handleErrorResponse(c, `Failed to retrieve user: ${error}`, 500);
    }
  }
);

export { usersRoute };
