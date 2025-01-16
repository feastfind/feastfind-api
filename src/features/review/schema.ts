import {
  MenuItemReviewSchema,
  MenuItemSchema,
  UserSchema,
} from '@prisma/generated/zod';

import { MenuItemImage } from '../menuItemImage/schema';

const menuItemWithImageSchema = MenuItemSchema.extend({
  images: MenuItemImage.array(),
});

export const MenuItemsReviews = MenuItemReviewSchema.extend({
  menuItem: menuItemWithImageSchema,
  user: UserSchema,
});

export const MenuItemsReviewsArray = MenuItemsReviews.array();
