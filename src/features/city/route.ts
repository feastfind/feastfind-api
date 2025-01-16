import { API_TAGS } from '@/config';
import { handleErrorResponse } from '@/utils/handleError';
import { OpenAPIHono } from '@hono/zod-openapi';

import * as citySchema from '@city/schema';
import * as cityService from '@city/service';

const citiesRoute = new OpenAPIHono();

citiesRoute.openapi(
  {
    method: 'get',
    path: '/',
    summary: 'Get all cities',
    description: 'Get a list of cities.',
    tags: API_TAGS.CITY,
    responses: {
      200: {
        description: 'Cities retrieved successfully',
        content: {
          'application/json': {
            schema: citySchema.GetCities,
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
      const cities = await cityService.getCities();

      return c.json(cities, 200);
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
    summary: 'Get city details',
    description: 'Get a city by slug or id.',
    tags: API_TAGS.CITY,
    request: {
      params: citySchema.CityParam,
    },
    responses: {
      200: {
        description: 'City retrieved successfully',
        content: { 'application/json': { schema: citySchema.City } },
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
      const { slug } = c.req.valid('param');

      const city = await cityService.getCityByParam(slug);

      if (!city) return handleErrorResponse(c, 'City not found', 404);

      return c.json(city, 200);
    } catch (error) {
      return handleErrorResponse(c, `Failed to retrieve city: ${error} `, 500);
    }
  }
);

export { citiesRoute };
