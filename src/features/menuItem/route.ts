import { OpenAPIHono } from '@hono/zod-openapi';
import { MenuItemSchema } from '../../../prisma/generated/zod';
import { API_TAGS } from '../../config/config';
import { authenticateUser } from '../../middlewares/authenticateUser';
import { handleErrorResponse } from '../../utils/handleError';
import {
  CreateMenuItemSchema,
  GetMenuItemReviewsBySlug,
  GetMenuItemReviewsBySlugRequestSchema,
  GetMenuItemsBySlugRequestSchema,
  GetMenuItemsBySlugSchema,
  GetMenuItemsSchema,
} from './schema';
import {
  createMenuItem,
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
    path: '/{slug}',
    description: 'Get a menu item by slug.',
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
      const { slug } = c.req.valid('param');

      const menuItem = await getMenuItemByParam(slug);

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
    path: '/{slug}/reviews',
    description: 'Get menu item reviews by menu item slug.',
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
      const { slug } = c.req.valid('param');

      const menuItem = await getMenuItemByParam(slug);

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

menuItemsRoute.openapi(
  {
    method: 'post',
    path: '/',
    description: 'Add a new menu item.',
    tags: API_TAGS.MENU_ITEM,
    security: [{ AuthorizationBearer: [] }],
    middleware: authenticateUser,
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreateMenuItemSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Menu Item created successfully',
        content: { 'application/json': { schema: MenuItemSchema } },
      },
      400: {
        description: 'Validation error',
      },
      404: {
        description: 'Place not found',
      },
      500: {
        description: 'Failed to create place',
      },
    },
  },
  async (c) => {
    try {
      const user = c.get('user');

      const { name, price, description, images, placeSlug } =
        c.req.valid('json');

      const username = user.username;

      const menuItem = await createMenuItem(
        name,
        price,
        description ?? '',
        images,
        username,
        placeSlug
      );

      return c.json(
        {
          message: 'Menu Item created successfully',
          menuItem,
        },
        201
      );
    } catch (error) {
      return handleErrorResponse(
        c,
        `Failed to create menu item: ${error} `,
        500
      );
    }
  }
);

export { menuItemsRoute };
