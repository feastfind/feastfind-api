import { OpenAPIHono, z } from '@hono/zod-openapi';
import { CitySchema } from '../../../prisma/generated/zod';
import { handleErrorResponse } from '../../utils/handleError';
import { getCities, getCityByParam } from './service';
import { API_TAGS } from '../../config/config';

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
    path: '/{param}',
    description: 'Get a city by param.',
    tags: API_TAGS.CITY,
    request: {
      params: z.object({
        param: z.string().max(255).openapi({ description: 'param: slug | id' }),
      }),
    },
    responses: {
      200: {
        description: 'City retrieved successfully',
        content: { 'application/json': { schema: CitySchema } },
      },
      400: {
        description: 'Invalid param',
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
