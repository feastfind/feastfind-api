import { z } from 'zod';
import { MenuItemSchema } from '../../../prisma/generated/zod';

export const GetMenuItemsSchema = z.object({
  count: z.number(),
  menuItems: MenuItemSchema.extend({
    price: z.string().refine((val) => Number(val)),
  }).array(),
});

export const GetMenuItemsBySlugRequestSchema = z.object({
  slug: z.string().max(255).openapi({ description: 'param: slug | id' }),
});

export const GetMenuItemsBySlugSchema = MenuItemSchema.extend({
  price: z.string().refine((val) => Number(val)),
});

export const GetMenuItemReviewsBySlugRequestSchema = z.object({
  slug: z
    .string()
    .max(255)
    .openapi({ description: 'param: menu slug | menu id' }),
});

export const GetMenuItemReviewsBySlug = z.object({
  count: z.number(),
  menuItemReviews: MenuItemSchema.array(),
});

export const CreateMenuItemSchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string().nullable(),
  images: z.array(z.object({ url: z.string() })),
  placeSlug: z.string(),
});

export const CreateMenuItemReviewSchema = z.object({
  menuItemId: z.string(),
  rating: z.number(),
  comment: z.string().nullable(),
});

export const DeleteMenuItemRequestParamSchema = z.object({
  slug: z.string().max(255).openapi({ description: 'param: slug | id' }),
})

export const DeleteMenuItemResponseSchema = z.object({
  message: z.string(),
  menuItem: MenuItemSchema
})