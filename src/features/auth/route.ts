import { OpenAPIHono } from '@hono/zod-openapi';
import { API_TAGS } from '../../config/config';
import { authenticateUser } from '../../middlewares/authenticateUser';
import { handleErrorResponse } from '../../utils/handleError';
import {
  LoginUserRequestSchema,
  LoginUserSchema,
  RegisterUserRequestSchema,
  RegisterUserSchema,
} from './schema';
import { loginUser, registerUser } from './service';
import { getDiceBearAvatar } from './utils';

const authRoute = new OpenAPIHono();

authRoute.openapi(
  {
    method: 'post',
    path: '/register',
    description: 'Register user.',
    tags: API_TAGS.AUTH,
    request: {
      body: {
        content: {
          'application/json': {
            schema: RegisterUserRequestSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'User registered successfully',
        content: { 'application/json': { schema: RegisterUserSchema } },
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
      const { name, username, email, avatarURL, password } =
        c.req.valid('json');

      const user = await registerUser(
        name,
        username,
        email,
        avatarURL ?? getDiceBearAvatar(username, 64),
        password
      );

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
    description: 'Login user.',
    tags: API_TAGS.AUTH,
    request: {
      body: {
        content: {
          'application/json': {
            schema: LoginUserRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'User logged in successfully',
        content: { 'application/json': { schema: LoginUserSchema } },
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
      const { identifier, password } = c.req.valid('json');

      const { token, user } = await loginUser(identifier, password);

      if (!token) {
        return handleErrorResponse(c, 'Invalid email or password', 401);
      }

      return c.json(
        {
          message: 'User logged in successfully',
          token,
          user,
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
    description: 'Get authenticated user information.',
    tags: API_TAGS.AUTH,
    security: [{ AuthorizationBearer: [] }],
    middleware: authenticateUser,
    responses: {
      200: {
        description: 'User information retrieved successfully',
      },
      401: {
        description:
          'Authorization header not found | Token not found | Invalid token | User not found',
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
