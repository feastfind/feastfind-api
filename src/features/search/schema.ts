import {
  MenuItemImageSchema,
  MenuItemSchema,
  PlaceSchema,
} from '@prisma/generated/zod';
import { z } from 'zod';

const searchMenuItem = MenuItemSchema.extend({
  images: MenuItemImageSchema.array(),
});

const searchPlace = PlaceSchema.extend({
  menuItems: searchMenuItem.array(),
});

const menuItemsWithPlace = searchMenuItem.extend({
  place: PlaceSchema,
});

export const SearchResponseSchema = z.object({
  places: searchPlace.array(),
  menuItems: menuItemsWithPlace.array(),
});
