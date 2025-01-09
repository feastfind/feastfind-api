import { API_TAGS } from '@/config/config';
import { authenticateUser } from '@/middlewares/authenticateUser';
import { handleErrorResponse } from '@/utils/handleError';
import { OpenAPIHono } from '@hono/zod-openapi';

import * as placeSchema from '@place/schema';
import * as placeService from '@place/service';

const placesRoute = new OpenAPIHono();

placesRoute.openapi(
  {
    method: 'get',
    path: '/',
    summary: 'Get all places',
    description: 'Get a list of places.',
    tags: API_TAGS.PLACE,
    responses: {
      200: {
        description: 'Places retrieved successfully',
        content: {
          'application/json': {
            schema: placeSchema.GetPlaces,
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
      const places = await placeService.getPlaces();

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

placesRoute.openapi(
  {
    method: 'get',
    path: '/{slug}',
    summary: 'Get place details',
    description: 'Get place details by slug or id.',
    tags: API_TAGS.PLACE,
    request: {
      params: placeSchema.PlacesParam,
    },
    responses: {
      200: {
        description: 'Place retrieved successfully',
        content: {
          'application/json': {
            schema: placeSchema.GetPlaceDetail,
          },
        },
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

      const place = await placeService.getPlaceByParam(slug);

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
    summary: 'Create a place',
    description: 'Add a new place.',
    tags: API_TAGS.PLACE,
    security: [{ AuthorizationBearer: [] }],
    middleware: authenticateUser,
    request: {
      body: {
        content: {
          'application/json': {
            schema: placeSchema.CreatePlace,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Place created successfully',
        content: { 'application/json': { schema: placeSchema.PlaceResponse } },
      },
      400: {
        description: 'Validation error',
      },
      403: {
        description: 'Forbidden',
      },
      500: {
        description: 'Failed to create place',
      },
    },
  },
  async (c) => {
    try {
      const { username } = c.get('user');

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

      const place = await placeService.createPlace(
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
    summary: 'Delete a place',
    description: 'Delete a place by slug or id.',
    tags: API_TAGS.PLACE,
    security: [{ AuthorizationBearer: [] }],
    middleware: authenticateUser,
    request: {
      params: placeSchema.PlacesParam,
    },
    responses: {
      200: {
        description: 'Place deleted successfully',
        content: { 'application/json': { schema: placeSchema.PlaceResponse } },
      },
      400: {
        description: 'Validation error',
      },
      401: {
        description: 'Unauthorized',
      },
      403: {
        description: 'Forbidden',
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
      const { username } = c.get('user');
      const { slug } = c.req.valid('param');

      const place = await placeService.deletePlaceBySlug(username, slug);

      return c.json(
        {
          message: 'Place deleted successfully',
          place,
        },
        200
      );
    } catch (error) {
      return handleErrorResponse(c, `Failed to delete place: ${error} `, 500);
    }
  }
);

placesRoute.openapi(
  {
    method: 'patch',
    path: '/{slug}',
    summary: 'Update a place',
    description: 'Update a place by slug or id.',
    tags: API_TAGS.PLACE,
    security: [{ AuthorizationBearer: [] }],
    middleware: authenticateUser,
    request: {
      params: placeSchema.PlacesParam,
      body: {
        content: {
          'application/json': {
            schema: placeSchema.UpdatePlace,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Place updated successfully',
        content: { 'application/json': { schema: placeSchema.PlaceResponse } },
      },
      400: {
        description: 'Validation error',
      },
      401: {
        description: 'Unauthorized',
      },
      403: {
        description: 'Forbidden',
      },
      404: {
        description: 'Place not found',
      },
      500: {
        description: 'Failed to update place',
      },
    },
  },
  async (c) => {
    try {
      const { username } = c.get('user');
      const { slug } = c.req.valid('param');

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

      const place = await placeService.updatePlace(
        slug,
        username,
        name,
        description ?? '',
        priceMin,
        priceMax,
        city,
        address,
        latitude,
        longitude
      );

      return c.json(
        {
          message: 'Place updated successfully',
          place,
        },
        200
      );
    } catch (error) {
      return handleErrorResponse(c, `Failed to update place: ${error} `, 500);
    }
  }
);

export { placesRoute };
