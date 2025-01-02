import { OpenAPIHono } from '@hono/zod-openapi';
import { API_TAGS } from '../../config/config';
import { handleErrorResponse } from '../../utils/handleError';
import {
  GetCitiesBySlugRequestSchema,
  GetCitiesBySlugSchema,
  GetCitiesSchema,
} from './schema';
import { getCities, getCityByParam } from './service';

const citiesRoute = new OpenAPIHono();

citiesRoute.openapi(
  {
    method: 'get',
    path: '/',
    description: 'Get a list of cities.',
    tags: API_TAGS.CITY,
    responses: {
      200: {
        description: 'Cities retrieved successfully',
        content: {
          'application/json': {
            schema: GetCitiesSchema,
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
      const { cities, count } = await getCities();

      return c.json(
        {
          count,
          cities,
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

citiesRoute.openapi(
  {
    method: 'get',
    path: '/{slug}',
    description: 'Get a city by slug.',
    tags: API_TAGS.CITY,
    request: {
      params: GetCitiesBySlugRequestSchema,
    },
    responses: {
      200: {
        description: 'City retrieved successfully',
        content: { 'application/json': { schema: GetCitiesBySlugSchema } },
      },
      400: {
        description: 'Invalid slug',
      },
      404: {
        description: 'City not found',
      },
      500: {
        description: 'Failed to retrieve city',
      },
    },
  },
  async (c) => {
    try {
      const { param } = c.req.valid('param');

      const city = await getCityByParam(param);

      if (!city) return handleErrorResponse(c, 'City not found', 404);

      return c.json(city, 200);
    } catch (error) {
      return handleErrorResponse(c, `Failed to retrieve city: ${error} `, 500);
    }
  }
);

export { citiesRoute };
