import { API_TAGS } from '@/config';
import { authenticateUser } from '@/middlewares/authenticateUser';
import { handleErrorResponse } from '@/utils/handleError';
import { OpenAPIHono } from '@hono/zod-openapi';

import * as menuSchema from '@menuItem/schema';
import * as menuService from '@menuItem/service';

const menuItemsRoute = new OpenAPIHono();

menuItemsRoute.openapi(
  {
    method: 'get',
    path: '/',
    summary: 'Get all menu items',
    description: 'Get a list of menu items.',
    tags: API_TAGS.MENU_ITEM,
    responses: {
      200: {
        description: 'Menu items retrieved successfully',
        content: {
          'application/json': {
            schema: menuSchema.MenuItemsArray,
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
      const menuItems = await menuService.getMenuItems();

      return c.json(menuItems, 200);
    } catch (error) {
      return handleErrorResponse(
        c,
        `Failed to retrieve menu items: ${error} `,
        500
      );
    }
  }
);

menuItemsRoute.openapi(
  {
    method: 'get',
    path: '/{slug}',
    summary: 'Get a menu item',
    description: 'Get a menu item by slug or id.',
    tags: API_TAGS.MENU_ITEM,
    request: {
      params: menuSchema.MenuItemParam,
    },
    responses: {
      200: {
        description: 'Menu item retrieved successfully',
        content: {
          'application/json': {
            schema: menuSchema.GetMenuItemDetail,
          },
        },
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

      const menuItem = await menuService.getMenuItemByParam(slug);

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
    method: 'post',
    path: '/',
    summary: 'Create a menu item',
    description: 'Add a new menu item.',
    tags: API_TAGS.MENU_ITEM,
    security: [{ AuthorizationBearer: [] }],
    middleware: authenticateUser,
    request: {
      body: {
        content: {
          'application/json': {
            schema: menuSchema.CreateMenuItem,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Menu item created successfully',
        content: {
          'application/json': { schema: menuSchema.MenuItemResponse },
        },
      },
      400: {
        description: 'Validation error',
      },
      404: {
        description: 'Place not found',
      },
      500: {
        description: 'Failed to create menu item',
      },
    },
  },
  async (c) => {
    try {
      const user = c.get('user');

      const { name, price, description, images, placeSlug } =
        c.req.valid('json');

      const username = user.username;

      const menuItem = await menuService.createMenuItem(
        name,
        price,
        description ?? '',
        images,
        username,
        placeSlug
      );

      return c.json(
        {
          message: 'Menu item created successfully',
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

menuItemsRoute.openapi(
  {
    method: 'delete',
    path: '/{slug}',
    summary: 'Delete a menu item',
    description: 'Delete a menu item by slug.',
    tags: API_TAGS.MENU_ITEM,
    security: [{ AuthorizationBearer: [] }],
    middleware: authenticateUser,
    request: {
      params: menuSchema.MenuItemParam,
    },
    responses: {
      200: {
        description: 'Menu item deleted successfully',
        content: {
          'application/json': { schema: menuSchema.MenuItemResponse },
        },
      },
      404: {
        description: 'Menu item not found',
      },
      500: {
        description: 'Failed to delete menu item',
      },
    },
  },
  async (c) => {
    try {
      const { username } = c.get('user');
      const { slug } = c.req.valid('param');

      const menuItem = await menuService.deleteMenuItemBySlug(username, slug);

      if (!menuItem) return handleErrorResponse(c, 'Menu item not found', 404);

      return c.json(
        {
          message: 'Menu Item deleted successfully',
          menuItem,
        },
        200
      );
    } catch (error) {
      return handleErrorResponse(
        c,
        `Failed to delete menu item: ${error} `,
        500
      );
    }
  }
);

menuItemsRoute.openapi(
  {
    method: 'patch',
    path: '/{slug}',
    summary: 'Update a menu item',
    description: 'Update a menu item by slug.',
    tags: API_TAGS.MENU_ITEM,
    security: [{ AuthorizationBearer: [] }],
    middleware: authenticateUser,
    request: {
      params: menuSchema.MenuItemParam,
      body: {
        content: {
          'application/json': {
            schema: menuSchema.UpdateMenuItem,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Menu item updated successfully',
        content: {
          'application/json': { schema: menuSchema.MenuItemResponse },
        },
      },
      400: {
        description: 'Validation error',
      },
      404: {
        description: 'Menu item not found',
      },
      500: {
        description: 'Failed to update menu item',
      },
    },
  },
  async (c) => {
    try {
      const { username } = c.get('user');
      const { slug } = c.req.valid('param');

      const { name, price, description, images, placeSlug } =
        c.req.valid('json');

      const menuItem = await menuService.updateMenuItem(
        slug,
        username,
        name,
        price,
        description ?? '',
        images,
        placeSlug
      );

      return c.json(
        {
          message: 'Menu item updated successfully',
          menuItem,
        },
        200
      );
    } catch (error) {
      return handleErrorResponse(
        c,
        `Failed to update menu item: ${error} `,
        500
      );
    }
  }
);

export { menuItemsRoute };
