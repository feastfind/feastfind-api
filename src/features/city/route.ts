import { OpenAPIHono } from '@hono/zod-openapi';
import { CitySchema } from '../../../prisma/generated/zod';
import { handleErrorResponse } from '../../utils/handleError';
import { getCities, getCityBySlug } from './service';
import { isValidCitySlug } from './utils';

const citiesRoute = new OpenAPIHono();
const API_TAGS = ['City'];

citiesRoute.openapi(
  {
    method: 'get',
    path: '/',
    description: 'Get a list of cities.',
    tags: API_TAGS,
    responses: {
      200: {
        description: 'Cities retrieved successfully',
        content: { 'application/json': { schema: CitySchema.array() } },
      },
      500: {
        description: 'Failed to retrieve cities',
      },
    },
  },
  async (c) => {
    try {
      const result = await getCities();

      return c.json(result, 200);
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
    path: '/:slug',
    description: 'Get a city by slug.',
    tags: API_TAGS,
    responses: {
      200: {
        description: 'City retrieved successfully',
        content: { 'application/json': { schema: CitySchema } },
      },
      400: {
        description: 'Invalid city slug',
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
      const slug = c.req.param('slug');

      if (!slug || !isValidCitySlug(slug)) {
        return handleErrorResponse(c, 'Invalid city slug', 400);
      }

      const city = await getCityBySlug(slug);

      if (!city) {
        return handleErrorResponse(
          c,
          'City not found',
          404
        );
      }

      return c.json(city, 200);
    } catch (error) {
      return handleErrorResponse(c, `Failed to retrieve city: ${error} `, 500);
    }
  }
);

export { citiesRoute };
