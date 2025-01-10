import { z } from 'zod';
import {
  MenuItemReviewSchema,
  MenuItemSchema,
} from '../../../prisma/generated/zod';

export const MenuItemResponseSchema = z.object({
  message: z.string(),
  menuItem: MenuItemSchema,
});

export const MenuItemReviewResponseSchema = z.object({
  message: z.string(),
  menuItemReview: MenuItemReviewSchema,
});

export const MenuItemRequestParamSchema = z.object({
  slug: z.string().max(255).openapi({ description: 'param: slug | id' }),
});

export const GetMenuItemsSchema = z.object({
  count: z.number(),
  menuItems: MenuItemSchema.extend({
    price: z.string().refine((val) => Number(val)),
  }).array(),
});

export const GetMenuItemsBySlugSchema = MenuItemSchema.extend({
  price: z.string().refine((val) => Number(val)),
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

export const UpdateMenuItemRequestBodySchema = z.object({
  name: z.string().optional(),
  price: z.number().optional(),
  description: z.string().nullable().optional(),
  images: z.array(z.object({ url: z.string() })).optional(),
  placeSlug: z.string().optional(),
});

export const UpdateMenuItemReviewRequestBodySchema = z.object({
  rating: z.number().optional(),
  comment: z.string().nullable().optional(),
});
