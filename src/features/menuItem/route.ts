import { OpenAPIHono, z } from '@hono/zod-openapi';
import { MenuItemSchema } from '../../../prisma/generated/zod';
import { handleErrorResponse } from '../../utils/handleError';
import {
  getMenuItemByParam,
  getMenuItemReviewsByMenuItemParam,
  getMenuItems,
} from './service';
import { API_TAGS } from '../../config/config';

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
        content: { 'application/json': { schema: MenuItemSchema.array() } },
      },
      500: {
        description: 'Failed to retrieve menu items',
      },
    },
  },
  async (c) => {
    try {
      const result = await getMenuItems();

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

menuItemsRoute.openapi(
  {
    method: 'get',
    path: '/{param}',
    description: 'Get a menu item by param.',
    tags: API_TAGS.MENU_ITEM,
    request: {
      params: z.object({
        param: z.string().max(255).openapi({ description: 'param: slug | id' }),
      }),
    },
    responses: {
      200: {
        description: 'Menu item retrieved successfully',
        content: { 'application/json': { schema: MenuItemSchema } },
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
      params: z.object({
        param: z
          .string()
          .max(255)
          .openapi({ description: 'param: menu slug | menu id' }),
      }),
    },
    responses: {
      200: {
        description: 'Menu item reviews retrieved successfully',
        content: { 'application/json': { schema: MenuItemSchema } },
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

      const menuItemReviews = await getMenuItemReviewsByMenuItemParam(
        menuItem.id
      );

      if (!menuItemReviews)
        return handleErrorResponse(c, 'Menu item reviews not found', 404);

      return c.json(menuItemReviews, 200);
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
