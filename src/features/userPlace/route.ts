import { API_TAGS } from '@/config';
import { authenticateUser } from '@/middlewares/authenticateUser';
import { handleErrorResponse } from '@/utils/handleError';
import { OpenAPIHono, z } from '@hono/zod-openapi';

import * as placeSchema from '@place/schema';
import { getUserPlaces } from './service';

const userPlaceRoute = new OpenAPIHono();

userPlaceRoute.openapi(
  {
    method: 'get',
    path: '/',
    summary: 'Get user places',
    description: 'Get a list of user places.',
    tags: API_TAGS.USER_PLACE,
    security: [{ AuthorizationBearer: [] }],
    middleware: authenticateUser,
    request: {
      query: z.object({
        page: z.string().optional(),
      }),
    },
    responses: {
      200: {
        description: 'Places retrieved successfully',
        content: {
          'application/json': {
            schema: placeSchema.PlacesArray,
          },
        },
      },
      500: {
        description: 'Failed to retrieve places',
      },
    },
  },
  async (c) => {
    try {
      const { id } = c.get('user');
      const { page } = c.req.valid('query');
      const places = await getUserPlaces(id, page);

      return c.json(places, 200);
    } catch (error) {
      return handleErrorResponse(
        c,
        `Failed to retrieve places: ${error} `,
        500
      );
    }
  }
);

export { userPlaceRoute };
