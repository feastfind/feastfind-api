import type { Context } from 'hono';
import type { StatusCode } from 'hono/utils/http-status';

export function handleErrorResponse(
  context: Context,
  message: string,
  statusCode: StatusCode
) {
  console.error(message);
  return context.json({ message }, statusCode);
}
