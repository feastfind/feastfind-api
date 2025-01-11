import { MenuItemSchema } from '@prisma/generated/zod';
import { z } from 'zod';

const MenuItem = MenuItemSchema.extend({
  price: z.string().refine((val) => Number(val)),
});

export const MenuItemParam = z.object({
  slug: z.string().max(255).openapi({ description: 'param: slug | id' }),
});

export const MenuItemResponse = z.object({
  message: z.string(),
  menuItem: MenuItem,
});

export const GetMenuItems = MenuItem.array();

export const GetMenuItemDetail = MenuItem

export const CreateMenuItem = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string().optional(),
  images: z.array(z.object({ url: z.string() })),
  placeSlug: z.string(),
});

export const UpdateMenuItem = z.object({
  name: z.string().optional(),
  price: z.number().optional(),
  description: z.string().nullable().optional(),
  images: z.array(z.object({ url: z.string() })).optional(),
  placeSlug: z.string().optional(),
});
