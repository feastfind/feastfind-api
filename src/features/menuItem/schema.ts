import { z } from 'zod';
import { MenuItemSchema } from '../../../prisma/generated/zod';

export const GetMenuItemsSchema = z.object({
  count: z.number(),
  menuItems: MenuItemSchema.extend({
    price: z.string().refine((val) => Number(val)),
  }).array(),
});

export const GetMenuItemsBySlugRequestSchema = z.object({
  param: z.string().max(255).openapi({ description: 'param: slug | id' }),
});

export const GetMenuItemsBySlugSchema = MenuItemSchema.extend({
  price: z.string().refine((val) => Number(val)),
});

export const GetMenuItemReviewsBySlugRequestSchema = z.object({
  param: z
    .string()
    .max(255)
    .openapi({ description: 'param: menu slug | menu id' }),
});

export const GetMenuItemReviewsBySlug = z.object({
  count: z.number(),
  menuItemReviews: MenuItemSchema.array(),
});
