import { MenuItem, MenuItemReview } from '../../../prisma/generated/zod';
import prisma from '../../lib/db';

export const getMenuItems = async (): Promise<{
  menuItems: MenuItem[];
  count: number;
}> => {
  const menuItems = await prisma.menuItem.findMany();
  const count = await prisma.menuItem.count();

  return { menuItems, count };
};

export const getMenuItemByParam = async (
  param: string
): Promise<MenuItem | null> => {
  return await prisma.menuItem.findFirst({
    where: {
      OR: [{ id: param }, { slug: param }],
    },
  });
};

export const getMenuItemReviewsByMenuItemParam = async (
  menuItemId: string
): Promise<{ menuItemReviews: MenuItemReview[]; count: number }> => {
  const menuItemReviews = await prisma.menuItemReview.findMany({
    where: {
      menuItemId,
    },
  });

  const count = await prisma.menuItemReview.count({
    where: {
      menuItemId,
    },
  });

  return { menuItemReviews, count };
};
