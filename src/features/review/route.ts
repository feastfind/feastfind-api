import { API_TAGS } from '@/config';
import { handleErrorResponse } from '@/utils/handleError';
import { OpenAPIHono, z } from '@hono/zod-openapi';

import * as reviewService from '@review/service';
import { MenuItemsReviewsArray } from './schema';

const reviewRoute = new OpenAPIHono();

reviewRoute.openapi(
  {
    method: 'get',
    path: '/',
    summary: 'Get all reviews',
    description: 'Get a list of reviews.',
    tags: API_TAGS.REVIEW,
    request: {
      query: z.object({
        rating: z.string().optional(),
        // page: z.string().optional(),
        limit: z.string().optional(),
      }),
    },
    responses: {
      200: {
        description: 'Reviews retrieved successfully',
        content: {
          'application/json': {
            schema: MenuItemsReviewsArray,
          },
        },
      },
      400: { description: 'Failed to reviews' },
      500: {
        description: 'Failed to retrieve reviews',
      },
    },
  },
  async (c) => {
    try {
      // const { rating, page } = c.req.valid('query');
      const { rating, limit } = c.req.valid('query');

      if (rating === 'highest') {
        const reviews = await reviewService.getHighestReviews(limit);

        return c.json(reviews, 200);
      }

      if (rating === 'lowest') {
        const reviews = await reviewService.getLowestReviews(limit);
        return c.json(reviews, 200);
      }

      const reviews = await reviewService.getReviews(limit);
      return c.json(reviews, 200);
    } catch (error) {
      return handleErrorResponse(
        c,
        `Failed to retrieve reviews: ${error} `,
        500
      );
    }
  }
);

export { reviewRoute };
