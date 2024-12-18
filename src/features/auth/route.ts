import { OpenAPIHono } from '@hono/zod-openapi';
import { UserSchema } from '../../../prisma/generated/zod';
import { authenticateUser } from '../../middlewares/authenticateUser';
import { handleErrorResponse } from '../../utils/handleError';
import { LoginUserSchema, RegisterUserSchema } from './schema';
import { loginUser, registerUser } from './service';

const authRoute = new OpenAPIHono();
const API_TAGS = ['Auth'];

authRoute.openapi(
  {
    method: 'post',
    path: '/register',
    description: 'Register user.',
    tags: API_TAGS,
    request: {
      body: {
        content: {
          'application/json': {
            schema: RegisterUserSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'User registered successfully',     
        content: { 'application/json': { schema: UserSchema } },
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
      const data = await c.req.json();
      const parsed = RegisterUserSchema.safeParse(data);

      if (!parsed.success) {
        return handleErrorResponse(
          c,
          `Validation error:${parsed.error.message}`,
          400
        );
      }

      const { name, username, email, avatarURL, password } = parsed.data;

      const user = await registerUser(
        name,
        username,
        email,
        avatarURL ?? '',
        password
      );

      return c.json({
        message: 'User registered successfully',
        user,
      }, 200);
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
    tags: API_TAGS,
    request: {
      body: {
        content: {
          'application/json': {
            schema: LoginUserSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'User logged in successfully',
        content: { 'application/json': { schema: UserSchema } },
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
      const data = await c.req.json();
      const parsed = LoginUserSchema.safeParse(data);

      if (!parsed.success) {
        return handleErrorResponse(
          c,
          `Validation error:${parsed.error.message}`,
          400
        );
      }

      const { email, password } = parsed.data;

      const { token, user } = await loginUser(email, password);

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
    tags: API_TAGS,
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
