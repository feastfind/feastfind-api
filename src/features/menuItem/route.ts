import { OpenAPIHono } from '@hono/zod-openapi';
import { API_TAGS } from '../../config/config';
import { handleErrorResponse } from '../../utils/handleError';
import {
  GetMenuItemReviewsBySlug,
  GetMenuItemReviewsBySlugRequestSchema,
  GetMenuItemsBySlugRequestSchema,
  GetMenuItemsBySlugSchema,
  GetMenuItemsSchema,
} from './schema';
import {
  getMenuItemByParam,
  getMenuItemReviewsByMenuItemParam,
  getMenuItems,
} from './service';

const menuItemsRoute = new OpenAPIHono();

menuItemsRoute.openapi(
  {
    method: 'get',
    path: '/',
    description: 'Get a list of menu items.',
    tags: API_TAGS.MENU_ITEM,
    responses: {
      200: {
        description: 'Menu Items retrieved successfully',
        content: {
          'application/json': {
            schema: GetMenuItemsSchema,
          },
        },
      },
      500: {
        description: 'Failed to retrieve menu items',
      },
    },
  },
  async (c) => {
    try {
      const { menuItems, count } = await getMenuItems();

      return c.json(
        {
          count,
          menuItems,
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

menuItemsRoute.openapi(
  {
    method: 'get',
    path: '/{param}',
    description: 'Get a menu item by param.',
    tags: API_TAGS.MENU_ITEM,
    request: {
      params: GetMenuItemsBySlugRequestSchema,
    },
    responses: {
      200: {
        description: 'Menu item retrieved successfully',
        content: {
          'application/json': {
            schema: GetMenuItemsBySlugSchema,
          },
        },
      },
      400: {
        description: 'Invalid param',
      },
      404: {
        description: 'Menu item not found',
      },
      500: {
        description: 'Failed to retrieve menu item',
      },
    },
  },
  async (c) => {
    try {
      const { param } = c.req.valid('param');

      const menuItem = await getMenuItemByParam(param);

      if (!menuItem) return handleErrorResponse(c, 'Menu item not found', 404);

      return c.json(menuItem, 200);
    } catch (error) {
      return handleErrorResponse(
        c,
        `Failed to retrieve menu item: ${error} `,
        500
      );
    }
  }
);

menuItemsRoute.openapi(
  {
    method: 'get',
    path: '/{param}/reviews',
    description: 'Get menu item reviews by menu param.',
    tags: API_TAGS.MENU_ITEM_REVIEW,
    request: {
      params: GetMenuItemReviewsBySlugRequestSchema,
    },
    responses: {
      200: {
        description: 'Menu item reviews retrieved successfully',
        content: { 'application/json': { schema: GetMenuItemReviewsBySlug } },
      },
      400: {
        description: 'Invalid menu param',
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
      const { param } = c.req.valid('param');

      const menuItem = await getMenuItemByParam(param);

      if (!menuItem) return handleErrorResponse(c, 'Menu item not found', 404);

      const { menuItemReviews, count } =
        await getMenuItemReviewsByMenuItemParam(menuItem.id);

      if (!menuItemReviews)
        return handleErrorResponse(c, 'Menu item reviews not found', 404);

      return c.json(
        {
          menuItemReviews,
          count,
        },
        200
      );
    } catch (error) {
      return handleErrorResponse(
        c,
        `Failed to retrieve menu item reviews: ${error} `,
        500
      );
    }
  }
);

export { menuItemsRoute };
