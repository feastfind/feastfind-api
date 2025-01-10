import { Context } from 'hono';
import { MenuItem, MenuItemReview } from '../../../prisma/generated/zod';
import prisma from '../../lib/db';
import { generateSlug } from '../../utils/slug';
import { isPlaceSlugExist } from '../places/service';

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

export const createMenuItem = async (
  name: string,
  price: number,
  description: string,
  images: { url: string }[],
  username: string,
  placeSlug: string
): Promise<Partial<MenuItem>> => {
  const isPlaceExist = await isPlaceSlugExist(placeSlug);

  // TODO: depending on how the frontend works, we may want to change this
  if (!isPlaceExist) {
    throw new Error('Place not found');
  }

  const menuItemSlug = generateSlug(name);
  const isMenuItemExist = await isMenuItemSlugExist(menuItemSlug);

  if (isMenuItemExist) {
    throw new Error('Menu Item already exists');
  }

  const newMenuItem = await prisma.menuItem.create({
    data: {
      slug: menuItemSlug,
      name,
      price,
      description,
      images: {
        createMany: {
          data: images,
        },
      },
      place: {
        connect: {
          slug: placeSlug,
        },
      },
      user: {
        connect: {
          username,
        },
      },
    },
  });

  return newMenuItem;
};

export const createMenuItemReview = async (
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

export const isMenuItemSlugExist = async (slug: string): Promise<boolean> => {
  const menuItem = await prisma.menuItem.findUnique({
    where: {
      slug,
    },
  });

  return menuItem !== null;
};
