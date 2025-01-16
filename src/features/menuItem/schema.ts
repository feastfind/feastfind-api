import {
  MenuItemImageSchema,
  MenuItemReviewSchema,
  MenuItemSchema,
  PlaceSchema,
  UserSchema,
} from '@prisma/generated/zod';
import { z } from 'zod';
import { Place } from '../place/schema';
import { MenuItemImage } from '../menuItemImage/schema';

const ReviewSchema = MenuItemReviewSchema.extend({
  user: UserSchema,
});

const MenuItem = MenuItemSchema.extend({
  price: z.string().refine((val) => Number(val)),
  images: MenuItemImageSchema.array(),
  reviews: ReviewSchema.array(),
  place: PlaceSchema,
});

export const MenuItemParam = z.object({
  slug: z.string().max(255).openapi({ description: 'param: slug | id' }),
});

export const MenuItemResponse = z.object({
  message: z.string(),
  menuItem: MenuItem,
});

export const MenuItemWithRelations = MenuItem.extend({
  place: Place,
  images: z.string().array(),
});

export const MenuItemsArray = MenuItem.array();

export const GetMenuItemDetail = MenuItem;

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
