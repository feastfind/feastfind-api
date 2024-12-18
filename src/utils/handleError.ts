import type { Context } from 'hono';
import type { StatusCode } from 'hono/utils/http-status';

export function handleErrorResponse(
  c: Context,
  message: string,
  statusCode: StatusCode
) {
  console.error(message);
  return c.json({ message }, statusCode);
}
