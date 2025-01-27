import prisma from '@/lib/db';
import { filterValidValues } from '@/utils/filterValid';
import { generateSlug } from '@/utils/slug';
import { isPlaceSlugExist } from '@place/service';
import { MenuItem } from '@prisma/generated/zod';

export const getMenuItems = async (): Promise<MenuItem[]> => {
  return await prisma.menuItem.findMany({
    include: {
      images: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      place: true,
      reviews: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getMenuItemByParam = async (
  param: string
): Promise<MenuItem | null> => {
  return await prisma.menuItem.findFirst({
    where: {
      OR: [{ id: param }, { slug: param }],
    },
    include: {
      images: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      place: true,
      reviews: {
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
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

export const deleteMenuItemBySlug = async (
  username: string,
  slug: string
): Promise<Partial<MenuItem>> => {
  const menuItem = await prisma.menuItem.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
      user: {
        username,
      },
    },
  });

  if (!menuItem) {
    throw new Error(
      "Menu item not found or you don't have permission to delete it."
    );
  }

  return await prisma.menuItem.delete({
    where: {
      id: menuItem.id,
    },
  });
};

export const updateMenuItem = async (
  slug: string,
  username: string,
  name?: string,
  price?: number,
  description?: string,
  images?: { url: string }[],
  placeSlug?: string
): Promise<Partial<MenuItem>> => {
  const menuItem = await prisma.menuItem.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
      user: {
        username,
      },
    },
    include: {
      images: true,
      place: true,
    },
  });

  if (!menuItem) {
    throw new Error(
      "Menu item not found or you don't have permission to update it."
    );
  }

  const data = filterValidValues({
    name,
    price,
    description,
    // placeSlug,
  });

  // TODO: updating images will require separate services, it also depends on how the frontend works
  if (images) {
    const imageUrls = images.map((image) => ({
      url: image.url,
    }));

    await prisma.menuItem.update({
      where: { id: menuItem.id },
      data: {
        images: {
          createMany: {
            data: imageUrls,
          },
        },
      },
    });
  }

  return await prisma.menuItem.update({
    where: { id: menuItem.id },
    data,
  });
};

export const isMenuItemSlugExist = async (slug: string): Promise<boolean> => {
  const menuItem = await prisma.menuItem.findUnique({
    where: { slug },
  });

  return menuItem !== null;
};

export const updateMenuItemRating = async (
  menuItemId: string,
  rating: number
) => {
  return await prisma.menuItem.update({
    where: {
      id: menuItemId,
    },
    data: {
      ratingScore: rating,
    },
  });
};
