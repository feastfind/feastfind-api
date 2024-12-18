import { OpenAPIHono } from '@hono/zod-openapi';
import {
  PlaceCreateWithoutCityInputSchema,
  PlaceSchema,
} from '../../../prisma/generated/zod';
import { authenticateUser } from '../../middlewares/authenticateUser';
import { handleErrorResponse } from '../../utils/handleError';
import { createPlace, getPlaceBySlug, getPlaces } from './service';
import { isValidPlaceSlug } from './utils';

const placesRoute = new OpenAPIHono();
const API_TAGS = ['Place'];

placesRoute.openapi(
  {
    method: 'get',
    path: '/',
    description: 'Get a list of places.',
    tags: API_TAGS,
    responses: {
      200: {
        description: 'Places retrieved successfully',
        content: { 'application/json': { schema: PlaceSchema.array() } },
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
    path: '/:slug',
    description: 'Get a place by slug.',
    tags: API_TAGS,
    responses: {
      200: {
        description: 'Place retrieved successfully',
        content: { 'application/json': { schema: PlaceSchema } },
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
      const slug = c.req.param('slug');

      if (!slug || !isValidPlaceSlug(slug)) {
        return handleErrorResponse(c, 'Invalid place slug', 400);
      }

      const place = await getPlaceBySlug(slug);

      if (!place) {
        return handleErrorResponse(c, 'Place not found', 404);
      }

      return c.json(place, 200);
    } catch (error) {
      return handleErrorResponse(c, `Failed to retrieve place: ${error} `, 500);
    }
  }
);

// placesRoute.openapi(
//   {
//     method: 'post',
//     path: '/',
//     description: 'Add a new place.',
//     tags: API_TAGS,
//     middleware: authenticateUser,
//     responses: {
//       201: {
//         description: 'Place created successfully',
//         content: { 'application/json': { schema: PlaceSchema } },
//       },
//       400: {
//         description: 'Validation error',
//       },
//       404: {
//         description: 'Place not found',
//       },
//       500: {
//         description: 'Failed to create place',
//       },
//     },
//   },
//   async (c) => {
//     try {
//       const data = await c.req.json();
//       const parsed = PlaceCreateWithoutCityInputSchema.safeParse(data);

//       if (!parsed.success) {
//         return handleErrorResponse(
//           c,
//           `Validation error: ${parsed.error.message}`,
//           400
//         );
//       }

//       const {
//         slug,
//         name,
//         description,
//         priceMin,
//         priceMax,
//         address,
//         latitude,
//         longitude,
//       } = parsed.data;

//       const place = await createPlace(
//         slug,
//         name,
//         description ?? "",
//         priceMin,
//         priceMax,
//         address,
//         latitude,
//         longitude
//       );


//     } catch (error) {
//       return handleErrorResponse(c, `Failed to create place: ${error} `, 500);
//     }
//   }
// );

export { placesRoute };
