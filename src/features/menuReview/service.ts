import prisma from '@/lib/db';
import { MenuItemReview } from '@prisma/generated/zod';

export const getReviews = async (
  menuItemId: string
): Promise<MenuItemReview[]> => {
  return await prisma.menuItemReview.findMany({
    where: {
      menuItemId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const createReview = async (
  menuItemId: string,
  userId: string,
  rating: number,
  comment: string
): Promise<Partial<MenuItemReview>> =>
  await prisma.menuItemReview.create({
    data: {
      menuItemId: menuItemId,
      userId: userId,
      rating,
      comment,
    },
  });

export const deleteReview = async (
  menuItemId: string,
  userId: string
): Promise<Partial<MenuItemReview>> => {
  const menuItemReview = await prisma.menuItemReview.findFirst({
    where: {
      menuItem: {
        id: menuItemId,
      },
      user: {
        id: userId,
      },
    },
  });

  if (!menuItemReview) {
    throw new Error(
      "Menu item review not found or you don't have permission to delete it."
    );
  }

  return await prisma.menuItemReview.delete({
    where: {
      id: menuItemReview.id,
    },
  });
};

export const updateReview = async (
  menuItemId: string,
  userId: string,
  rating?: number,
  comment?: string
): Promise<Partial<MenuItemReview>> => {
  const menuItemReview = await prisma.menuItemReview.findFirst({
    where: {
      menuItem: {
        id: menuItemId,
      },
      user: {
        id: userId,
      },
    },
  });

  if (!menuItemReview) {
    throw new Error(
      "Menu item review not found or you don't have permission to update it."
    );
  }

  return await prisma.menuItemReview.update({
    where: {
      id: menuItemReview.id,
    },
    data: {
      rating,
      comment,
    },
  });
};
