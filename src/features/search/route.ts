import { API_TAGS } from '@/config';
import prisma from '@/lib/db';
import { handleErrorResponse } from '@/utils/handleError';
import { OpenAPIHono, z } from '@hono/zod-openapi';
import { MenuItemWithRelations } from '@menuItem/schema';
import { PlacesArray } from '@place/schema';
import { SearchResponseSchema } from './schema';

const searchRoute = new OpenAPIHono();

// /search?q=keyword
searchRoute.openapi(
  {
    method: 'get',
    path: '/',
    summary: 'Get searched places and menu items',
    description: 'Search places and menu items by keyword.',
    tags: API_TAGS.SEARCH,
    request: {
      query: z.object({
        q: z.string().min(1),
      }),
    },
    responses: {
      200: {
        description: 'Search results',
        content: {
          'application/json': {
            schema: SearchResponseSchema,
          },
        },
      },
      400: { description: 'Failed to search' },
      500: { description: 'Failed to search' },
    },
  },
  async (c) => {
    try {
      const { q } = c.req.valid('query');

      const [places, menuItems] = await Promise.all([
        prisma.place.findMany({
          where: {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
            ],
          },
          include: {
            menuItems: {
              include: { images: { orderBy: { createdAt: 'desc' } } },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        prisma.menuItem.findMany({
          where: {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
            ],
          },
          include: {
            images: {
              orderBy: {
                createdAt: 'desc',
              },
            },
            place: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
      ]);

      return c.json({ places, menuItems }, 200);
    } catch (error) {
      return handleErrorResponse(c, `Failed to search: ${error}`, 500);
    }
  }
);

export { searchRoute };
