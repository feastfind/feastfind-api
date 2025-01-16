import {
  MenuItemReviewSchema,
  MenuItemSchema,
  PlaceSchema,
  UserSchema,
} from '@prisma/generated/zod';

import { MenuItemImage } from '../menuItemImage/schema';

const menuItemWithImageSchema = MenuItemSchema.extend({
  images: MenuItemImage.array(),
});

export const MenuItemsReviews = MenuItemReviewSchema.extend({
  menuItem: menuItemWithImageSchema,
  user: UserSchema,
  place: PlaceSchema,
});

export const MenuItemsReviewsArray = MenuItemsReviews.array();
