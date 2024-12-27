import { OpenAPIHono, z } from '@hono/zod-openapi';
import { PlaceSchema } from '../../../prisma/generated/zod';
import { API_TAGS } from '../../config/config';
import { authenticateUser } from '../../middlewares/authenticateUser';
import { handleErrorResponse } from '../../utils/handleError';
import { CreatePlaceSchema } from './schema';
import { createPlace, getPlaceByParam, getPlaces } from './service';

const placesRoute = new OpenAPIHono();

placesRoute.openapi(
  {
    method: 'get',
    path: '/',
    description: 'Get a list of places.',
    tags: API_TAGS.PLACE,
    responses: {
      200: {
        description: 'Places retrieved successfully',
        content: {
          'application/json': {
            schema: PlaceSchema.extend({
              priceMin: z.string().refine((val) => Number(val)),
              priceMax: z.string().refine((val) => Number(val)),
            }).array(),
          },
        },
      },
      500: {
        description: 'Failed to retrieve cities',
      },
    },
  },
  async (c) => {
    try {
      const places = await getPlaces();

      return c.json(places, 200);
    } catch (error) {
      return handleErrorResponse(
        c,
        `Failed to retrieve cities: ${error} `,
        500
      );
    }
  }
);

placesRoute.openapi(
  {
    method: 'get',
    path: '/{param}',
    description: 'Get a place by param.',
    tags: API_TAGS.PLACE,
    request: {
      params: z.object({
        param: z.string().max(255).openapi({ description: 'param: slug | id' }),
      }),
    },
    responses: {
      200: {
        description: 'Place retrieved successfully',
        content: {
          'application/json': {
            schema: PlaceSchema.extend({
              priceMin: z.string().refine((val) => Number(val)),
              priceMax: z.string().refine((val) => Number(val)),
            }),
          },
        },
      },
      400: {
        description: 'Invalid place slug',
      },
      404: {
        description: 'Place not found',
      },
      500: {
        description: 'Failed to retrieve place',
      },
    },
  },
  async (c) => {
    try {
      const { param } = c.req.valid('param');

      const place = await getPlaceByParam(param);

      if (!place) return handleErrorResponse(c, 'Place not found', 404);

      return c.json(place, 200);
    } catch (error) {
      return handleErrorResponse(c, `Failed to retrieve place: ${error} `, 500);
    }
  }
);

placesRoute.openapi(
  {
    method: 'post',
    path: '/',
    description: 'Add a new place.',
    tags: API_TAGS.PLACE,
    security: [{ AuthorizationBearer: [] }],
    middleware: authenticateUser,
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreatePlaceSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Place created successfully',
        content: { 'application/json': { schema: PlaceSchema } },
      },
      400: {
        description: 'Validation error',
      },
      404: {
        description: 'Place not found',
      },
      500: {
        description: 'Failed to create place',
      },
    },
  },
  async (c) => {
    try {
      const user = c.get('user');

      const {
        name,
        description,
        priceMin,
        priceMax,
        city,
        address,
        latitude,
        longitude,
      } = c.req.valid('json');

      const username = user.username;

      const place = await createPlace(
        name,
        description ?? '',
        priceMin,
        priceMax,
        city,
        address,
        latitude,
        longitude,
        username
      );

      return c.json(
        {
          message: 'Place created successfully',
          place,
        },
        201
      );
    } catch (error) {
      return handleErrorResponse(c, `Failed to create place: ${error} `, 500);
    }
  }
);

export { placesRoute };
