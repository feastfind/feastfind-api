import { OpenAPIHono } from '@hono/zod-openapi';
import { PlaceSchema } from '../../../prisma/generated/zod';
import { API_TAGS } from '../../config/config';
import { authenticateUser } from '../../middlewares/authenticateUser';
import { handleErrorResponse } from '../../utils/handleError';
import {
  CreatePlaceSchema,
  DeletePlaceRequestSchema,
  DeletePlaceResponseSchema,
  GetPlacesBySlugRequestSchema,
  GetPlacesBySlugSchema,
  GetPlacesSchema,
} from './schema';
import {
  createPlace,
  deletePlaceBySlug,
  getPlaceByParam,
  getPlaces,
} from './service';

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
            schema: GetPlacesSchema,
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
      const { places, count } = await getPlaces();

      return c.json(
        {
          count,
          places,
        },
        200
      );
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
    path: '/{slug}',
    description: 'Get a place by slug.',
    tags: API_TAGS.PLACE,
    request: {
      params: GetPlacesBySlugRequestSchema,
    },
    responses: {
      200: {
        description: 'Place retrieved successfully',
        content: {
          'application/json': {
            schema: GetPlacesBySlugSchema,
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
      const { slug } = c.req.valid('param');

      const place = await getPlaceByParam(slug);

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

placesRoute.openapi(
  {
    method: 'delete',
    path: '/{slug}',
    description: 'Delete a place.',
    tags: API_TAGS.PLACE,
    security: [{ AuthorizationBearer: [] }],
    middleware: authenticateUser,
    request: {
      params: DeletePlaceRequestSchema,
    },
    responses: {
      200: {
        description: 'Place deleted successfully',
        content: { 'application/json': { schema: DeletePlaceResponseSchema } },
      },
      400: {
        description: 'Validation error',
      },
      404: {
        description: 'Place not found',
      },
      500: {
        description: 'Failed to delete place',
      },
    },
  },
  async (c) => {
    try {
      const user = c.get('user');
      const { slug } = c.req.valid('param');

      const place = await deletePlaceBySlug(user.username, slug);

      return c.json(
        {
          message: 'Place deleted successfully',
          place,
        },
        201
      );
    } catch (error) {
      return handleErrorResponse(c, `Failed to delete place: ${error} `, 500);
    }
  }
);

export { placesRoute };
