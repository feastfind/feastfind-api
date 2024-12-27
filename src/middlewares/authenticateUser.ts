import { createMiddleware } from 'hono/factory';
import prisma from '../lib/db';
import { handleErrorResponse } from '../utils/handleError';
import { validateToken } from '../utils/token';

type Env = {
  Variables: {
    user: {
      id: string;
      name: string;
      username: string;
      email: string;
      avatarURL: string;
    };
  };
};

export const authenticateUser = createMiddleware<Env>(async (c, next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader) {
    return handleErrorResponse(c, 'Authorization header not found', 401);
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return handleErrorResponse(c, 'Token not found', 401);
  }

  const payload = (await validateToken(token)) as { userId: string };

  if (!payload) {
    return handleErrorResponse(c, 'Invalid token', 401);
  }

  const user = await prisma.user.findUnique({
    where: {
      id: payload.userId,
    }
  });

  if (!user) {
    return handleErrorResponse(c, 'User not found', 401);
  }

  c.set('user', {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    avatarURL: user.avatarURL ?? ''
  });

  await next();
});
