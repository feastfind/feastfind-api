import { API_TAGS } from '@/config';
import { authenticateUser } from '@/middlewares/authenticateUser';
import { avgMenuItemRating, avgPlaceRating } from '@/utils/aggreateRating';
import { handleErrorResponse } from '@/utils/handleError';
import { OpenAPIHono } from '@hono/zod-openapi';

import * as menuItemService from '@menuItem/service';

import * as reviewSchema from '@menuReview/schema';
import * as reviewService from '@menuReview/service';
import { updatePlaceRating } from '../place/service';

const menuItemReviewsRoute = new OpenAPIHono();

menuItemReviewsRoute.openapi(
  {
    method: 'get',
    path: '/{slug}/reviews',
    summary: 'Get menu item reviews',
    description: 'Get all reviews on a menu item by slug.',
    tags: API_TAGS.MENU_ITEM_REVIEW,
    request: {
      params: reviewSchema.ReviewParam,
    },
    responses: {
      200: {
        description: 'Menu item reviews retrieved successfully',
        content: { 'application/json': { schema: reviewSchema.GetReviews } },
      },
      404: {
        description: 'Menu item reviews not found',
      },
      500: {
        description: 'Failed to retrieve menu item reviews',
      },
    },
  },
  async (c) => {
    try {
      const { slug } = c.req.valid('param');

      const menuItem = await menuItemService.getMenuItemByParam(slug);

      if (!menuItem) return handleErrorResponse(c, 'Menu item not found', 404);

      const reviews = await reviewService.getReviews(menuItem.id);

      if (!reviews) {
        return handleErrorResponse(c, 'Menu item reviews not found', 404);
      }

      return c.json(reviews, 200);
    } catch (error) {
      return handleErrorResponse(
        c,
        `Failed to retrieve menu item reviews: ${error} `,
        500
      );
    }
  }
);

menuItemReviewsRoute.openapi(
  {
    method: 'post',
    path: '/{slug}/reviews',
    summary: 'Add a menu item review',
    description: 'Add a new menu item review.',
    tags: API_TAGS.MENU_ITEM_REVIEW,
    security: [{ AuthorizationBearer: [] }],
    middleware: authenticateUser,
    request: {
      params: reviewSchema.ReviewParam,
      body: {
        content: {
          'application/json': {
            schema: reviewSchema.CreateReview,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Menu item review created successfully',
        content: {
          'application/json': { schema: reviewSchema.ReviewResponse },
        },
      },
      400: {
        description: 'Validation error',
      },
      404: {
        description: 'Menu item not found',
      },
      500: {
        description: 'Failed to create menu item review',
      },
    },
  },
  async (c) => {
    try {
      const { id } = c.get('user');
      const { slug } = c.req.valid('param');

      const menuItem = await menuItemService.getMenuItemByParam(slug);

      if (!menuItem) return handleErrorResponse(c, 'Menu item not found', 404);

      const { rating, comment } = c.req.valid('json');

      const menuItemReview = await reviewService.createReview(
        menuItem.id,
        id,
        rating,
        comment ?? ''
      );

      // UPDATE RATING SCORE

      const avgRatingOfMenuItem = await avgMenuItemRating(menuItem.id);

      if (avgRatingOfMenuItem) {
        console.log(avgRatingOfMenuItem);
        console.log(menuItem.id);
        await menuItemService.updateMenuItemRating(
          menuItem.id,
          avgRatingOfMenuItem
        );
      }

      const avgRatingOfPlace = await avgPlaceRating(menuItem.placeId);

      if (avgRatingOfPlace) {
        console.log(avgRatingOfPlace);
        console.log(menuItem.placeId);
        await updatePlaceRating(menuItem.placeId, avgRatingOfPlace);
      }

      return c.json(
        {
          message: 'Menu Item review created successfully',
          menuItemReview,
        },
        201
      );
    } catch (error) {
      return handleErrorResponse(
        c,
        `Failed to create menu item review: ${error} `,
        500
      );
    }
  }
);

menuItemReviewsRoute.openapi(
  {
    method: 'delete',
    path: '/{slug}/reviews',
    summary: 'Delete a menu item review',
    description: 'Delete a menu item review by username and menu slug.',
    tags: API_TAGS.MENU_ITEM_REVIEW,
    security: [{ AuthorizationBearer: [] }],
    middleware: authenticateUser,
    request: {
      params: reviewSchema.ReviewParam,
    },
    responses: {
      200: {
        description: 'Menu item review deleted successfully',
        content: {
          'application/json': { schema: reviewSchema.ReviewResponse },
        },
      },
      404: {
        description: 'Menu item review not found',
      },
      500: {
        description: 'Failed to delete menu item review',
      },
    },
  },
  async (c) => {
    try {
      const { id } = c.get('user');
      const { slug } = c.req.valid('param');

      const menuItem = await menuItemService.getMenuItemByParam(slug);

      if (!menuItem) return handleErrorResponse(c, 'Menu item not found', 404);

      const review = await reviewService.deleteReview(menuItem.id, id);

      const avgRatingOfMenuItem = await avgMenuItemRating(menuItem.id);
      if (avgRatingOfMenuItem) {
        await menuItemService.updateMenuItemRating(
          menuItem.id,
          avgRatingOfMenuItem
        );
      }

      const avgRatingOfPlace = await avgPlaceRating(menuItem.placeId);
      if (avgRatingOfPlace) {
        await updatePlaceRating(menuItem.placeId, avgRatingOfPlace);
      }

      return c.json(
        {
          message: 'Menu Item review deleted successfully',
          review,
        },
        200
      );
    } catch (error) {
      return handleErrorResponse(
        c,
        `Failed to delete menu item review: ${error} `,
        500
      );
    }
  }
);

menuItemReviewsRoute.openapi(
  {
    method: 'patch',
    path: '/{slug}/reviews',
    summary: 'Update a menu item review',
    description: 'Update a menu item review by username and slug.',
    tags: API_TAGS.MENU_ITEM_REVIEW,
    security: [{ AuthorizationBearer: [] }],
    middleware: authenticateUser,
    request: {
      params: reviewSchema.ReviewParam,
      body: {
        content: {
          'application/json': {
            schema: reviewSchema.UpdateReview,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Menu item review updated successfully',
        content: {
          'application/json': { schema: reviewSchema.ReviewResponse },
        },
      },
      400: {
        description: 'Validation error',
      },
      404: {
        description: 'Menu item review not found',
      },
      500: {
        description: 'Failed to update menu item review',
      },
    },
  },
  async (c) => {
    try {
      const { id } = c.get('user');
      const { slug } = c.req.valid('param');

      const menuItem = await menuItemService.getMenuItemByParam(slug);

      if (!menuItem) return handleErrorResponse(c, 'Menu item not found', 404);

      const { rating, comment } = c.req.valid('json');

      const review = await reviewService.updateReview(
        menuItem.id,
        id,
        rating,
        comment ?? ''
      );

      return c.json(
        {
          message: 'Menu item review updated successfully',
          review,
        },
        200
      );
    } catch (error) {
      return handleErrorResponse(
        c,
        `Failed to update menu item review: ${error}`,
        500
      );
    }
  }
);

export { menuItemReviewsRoute };
