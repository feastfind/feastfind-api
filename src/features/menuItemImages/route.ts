import { API_TAGS } from '@/config';
import { authenticateUser } from '@/middlewares/authenticateUser';
import { handleErrorResponse } from '@/utils/handleError';
import { OpenAPIHono } from '@hono/zod-openapi';

import * as menuItemImagesSchema from '@menuItemImages/schema';
import * as menuItemImagesService from '@menuItemImages/service';

const menuItemImagesRoute = new OpenAPIHono();

menuItemImagesRoute.openapi(
  {
    method: 'delete',
    path: '/{menuItemId}/{imageId}',
    summary: 'Delete a menu item images review',
    description: 'Delete a menu item images by slug.',
    tags: API_TAGS.MENU_ITEM_IMAGES_REVIEW,
    security: [{ AuthorizationBearer: [] }],
    middleware: authenticateUser,
    request: {
      params: menuItemImagesSchema.MenuItemImagesParam,
    },
    responses: {
      200: {
        description: 'Menu item review deleted successfully',
        content: {
          'application/json': {
            schema: menuItemImagesSchema.MenuItemImagesResponse,
          },
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
      const { menuItemId, imageId } = c.req.valid('param');

      await menuItemImagesService.deleteMenuItemImagesById(menuItemId, imageId);

      return c.json(
        {
          message: 'Menu Item image deleted successfully',
        },
        200
      );
    } catch (error) {
      return handleErrorResponse(
        c,
        `Failed to delete menu item image: ${error} `,
        500
      );
    }
  }
);

export { menuItemImagesRoute };
