import {
  MenuItemReviewSchema,
  MenuItemSchema,
  PlaceSchema,
  UserSchema,
} from '@prisma/generated/zod';

import { MenuItemImage } from '../menuItemImages/schema';

const menuItemWithImageSchema = MenuItemSchema.extend({
  images: MenuItemImage.array(),
  place: PlaceSchema,
});

export const MenuItemsReviews = MenuItemReviewSchema.extend({
  menuItem: menuItemWithImageSchema,
  user: UserSchema,
});

export const MenuItemsReviewsArray = MenuItemsReviews.array();
