import { MenuItem, MenuItemReview } from '../../../prisma/generated/zod';
import prisma from '../../lib/db';

export const getMenuItems = async (): Promise<MenuItem[]> => {
  return await prisma.menuItem.findMany();
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
): Promise<MenuItemReview[]> => {
  return await prisma.menuItemReview.findMany({
    where: {
      menuItemId,
    },
  });
};
