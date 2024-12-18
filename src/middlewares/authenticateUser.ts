import { createMiddleware } from 'hono/factory';
import { validateToken } from '../utils/token';
import { getUserById } from '../features/user/service';
import { handleErrorResponse } from '../utils/handleError';

type Env = {
  Variables: {
    user: {
      id: string;
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

  const user = await getUserById(payload.userId);

  if (!user) {
    return handleErrorResponse(c, 'User not found', 401);
  }

  c.set('user', user);

  await next();
});
