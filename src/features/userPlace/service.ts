import prisma from '@/lib/db';
import { MenuItem, Place } from '@prisma/generated/zod';

interface PlaceWithImages extends Omit<Place, 'menuItems'> {
  images: string[];
}

interface PlaceWithMenuItems extends Place {
  menuItems: MenuItem[];
}

export const getUserPlaces = async (
  userId: string,
  page?: string | undefined
): Promise<PlaceWithImages[]> => {
  const takeItem = 20;
  const skipItem = page ? Number(page) * takeItem - takeItem : 0;

  const places = await prisma.place.findMany({
    where: {
      userId: userId,
    },
    include: { menuItems: { select: { images: true } } },
    skip: skipItem,
    take: takeItem,
    orderBy: {
      createdAt: 'desc',
    },
  });

  const placesWithImages = places.map(({ menuItems, ...rest }) => ({
    ...rest,
    images: menuItems.flatMap((menuItem) =>
      menuItem.images.map((image) => image.url)
    ),
  }));

  return placesWithImages;
};
