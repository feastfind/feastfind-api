import { MenuItem, MenuItemReview } from '../../../prisma/generated/zod';
import prisma from '../../lib/db';
import { isValidCUID } from '../../utils/regex';

export const getMenuItems = async (): Promise<MenuItem[]> => {
  return await prisma.menuItem.findMany();
};

export const getMenuItemByParam = async (
  param: string
): Promise<MenuItem | null> => {
  const isCUID = isValidCUID(param);

  return await prisma.menuItem.findUnique({
    where: isCUID ? { id: param } : { slug: param },
  });
};

export const getMenuItemReviewsByMenuItemParam = async (
  menuItemId: string
): Promise<MenuItemReview[] | null> =>
  await prisma.menuItemReview.findMany({
    where: {
      menuItemId,
    },
  });
