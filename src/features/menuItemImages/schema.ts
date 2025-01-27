import { MenuItemImageSchema } from '@prisma/generated/zod';
import { z } from 'zod';

export const MenuItemImagesParam = z.object({
  menuItemId: z.string().max(255),
  imageId: z.string().max(255),
});

export const MenuItemImagesResponse = z.object({
  message: z.string(),
  menuItem: MenuItemImageSchema,
});

export const MenuItemImage = MenuItemImageSchema;
