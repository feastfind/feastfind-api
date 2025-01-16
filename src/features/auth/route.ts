import { API_TAGS } from '@/config';
import { authenticateUser } from '@/middlewares/authenticateUser';
import { handleErrorResponse } from '@/utils/handleError';
import { OpenAPIHono } from '@hono/zod-openapi';

import * as authSchema from '@auth/schema';
import * as authService from '@auth/service';

const authRoute = new OpenAPIHono();

authRoute.openapi(
  {
    method: 'post',
    path: '/register',
    summary: 'Register user',
    description: 'Register a new user.',
    tags: API_TAGS.AUTH,
    request: {
      body: {
        content: {
          'application/json': {
            schema: authSchema.RegisterUser,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'User registered successfully',
        content: { 'application/json': { schema: authSchema.UserResponse } },
      },
      400: {
        description: 'Validation error',
      },
      500: {
        description: 'Failed to register user',
      },
    },
  },
  async (c) => {
    try {
      const user = await authService.registerUser(c.req.valid('json'));

      return c.json(
        {
          message: 'User registered successfully',
          user,
        },
        201
      );
    } catch (error) {
      return handleErrorResponse(c, `Failed to register user: ${error} `, 500);
    }
  }
);

authRoute.openapi(
  {
    method: 'post',
    path: '/login',
    summary: 'Login user',
    description: 'Login user by email or username.',
    tags: API_TAGS.AUTH,
    request: {
      body: {
        content: {
          'application/json': {
            schema: authSchema.LoginUser,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'User logged in successfully',
        content: {
          'application/json': { schema: authSchema.LoginUserResponse },
        },
      },
      400: {
        description: 'Validation error',
      },
      401: {
        description: 'Invalid email or password',
      },
      500: {
        description: 'Failed to login user',
      },
    },
  },
  async (c) => {
    try {
      const { token, user } = await authService.loginUser(c.req.valid('json'));

      if (!token) {
        return handleErrorResponse(c, 'Invalid email or password', 401);
      }

      return c.json(
        {
          message: 'User logged in successfully',
          user,
          token,
        },
        200
      );
    } catch (error) {
      return handleErrorResponse(c, `Failed to login user: ${error} `, 500);
    }
  }
);

authRoute.openapi(
  {
    method: 'get',
    path: '/me',
    summary: 'Get authenticated user',
    description: 'Get authenticated user information.',
    tags: API_TAGS.AUTH,
    security: [{ AuthorizationBearer: [] }],
    middleware: authenticateUser,
    responses: {
      200: {
        description: 'User information retrieved successfully',
        content: {
          'application/json': { schema: authSchema.UserResponse },
        },
      },
      401: {
        description: 'Invalid token',
      },
      500: {
        description: 'Failed to retrieve user information',
      },
    },
  },
  async (c) => {
    try {
      const user = c.get('user');

      return c.json(
        {
          message: 'User information retrieved successfully',
          user,
        },
        200
      );
    } catch {
      return handleErrorResponse(c, 'Failed to retrieve user information', 500);
    }
  }
);

export { authRoute };
