import { OpenAPIHono } from '@hono/zod-openapi';
import { API_TAGS } from '../../config/config';
import { MenuItemRequestParamSchema } from '../menuItem/schema';

const searchRoute = new OpenAPIHono();

searchRoute.openapi(
  {
    method: 'get',
    path: '',
    description: 'Get a menu item by keyword.',
    tags: API_TAGS.SEARCH,
    request: {
      //   params: MenuItemRequestParamSchema,
      query: MenuItemRequestParamSchema,
    },
    responses: {
      200: {
        description: 'Menu item retrieved successfully',
        // content: {
        //   'application/json': {
        //     schema: GetMenuItemsBySlugSchema,
        //   },
        // },
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
      const { slug } = c.req.valid('query');

      console.log(slug);
      //   const menuItem = await getMenuItemByParam(slug);

      //   if (!menuItem) return handleErrorResponse(c, 'Menu item not found', 404);

      //   return c.json(menuItem, 200);
      return c.json('success', 200);
    } catch (error) {
      return c.json('error', 500);
      //   return handleErrorResponse(
      //     c,
      //     `Failed to retrieve menu item: ${error} `,
      //     500
      //   );
    }
  }
);

export { searchRoute };
