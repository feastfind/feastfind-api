import prisma from '@/lib/db';
import { filterValidValues } from '@/utils/filterValid';
import { generateSlug } from '@/utils/slug';
import { createCity, isCitySlugExist } from '@city/service';
import { MenuItem, Place } from '@prisma/generated/zod';

interface PlaceWithImages extends Omit<Place, 'menuItems'> {
  images: string[];
}

interface PlaceWithMenuItems extends Place {
  menuItems: MenuItem[];
}

export const getPlaces = async (): Promise<{
  places: PlaceWithImages[];
  count: number;
}> => {
  const places = await prisma.place.findMany({
    include: { menuItems: { select: { images: true } } },
  });
  const count = await prisma.place.count();

  const placesWithImages = places.map(({ menuItems, ...rest }) => ({
    ...rest,
    images: menuItems.flatMap((menuItem) =>
      menuItem.images.map((image) => image.url)
    ),
  }));

  return { places: placesWithImages, count };
};

export const getPlaceByParam = async (
  param: string
): Promise<PlaceWithMenuItems | null> => {
  const place = await prisma.place.findFirst({
    where: {
      OR: [{ id: param }, { slug: param }],
    },
    include: {
      menuItems: {
        include: {
          images: true,
        },
      },
    },
  });

  if (!place) {
    return null;
  }

  const menuItems = place.menuItems.map((menuItem) => ({
    ...menuItem,
    images: menuItem.images.map((image) => image.url),
  }));

  const { menuItems: originalMenuItems, ...rest } = place;

  return {
    ...rest,
    menuItems,
  };
};

export const createPlace = async (
  name: string,
  description: string,
  priceMin: number,
  priceMax: number,
  city: string,
  address: string,
  latitude: number,
  longitude: number,
  username: string
): Promise<Partial<Place>> => {
  const placeSlug = generateSlug(name);
  const isPlaceExist = await isPlaceSlugExist(placeSlug);

  if (isPlaceExist) {
    throw new Error('Place already exists');
  }

  const citySlug = generateSlug(city);
  const isCityExist = await isCitySlugExist(citySlug);

  let newPlace;

  if (!isCityExist) {
    // TODO: this will create a new city with place's latitude and longitude not city's
    const newCity = await createCity(citySlug, city, latitude, longitude);

    newPlace = await prisma.place.create({
      data: {
        slug: placeSlug,
        name,
        description,
        priceMin: priceMin,
        priceMax: priceMax,
        city: {
          connect: {
            id: newCity.id,
          },
        },
        address,
        latitude,
        longitude,
        user: {
          connect: {
            username,
          },
        },
      },
    });
  } else {
    newPlace = await prisma.place.create({
      data: {
        slug: placeSlug,
        name,
        description,
        priceMin: priceMin,
        priceMax: priceMax,
        city: {
          connect: {
            slug: citySlug,
          },
        },
        address,
        latitude,
        longitude,
        user: {
          connect: {
            username,
          },
        },
      },
    });
  }

  return newPlace;
};

export const deletePlaceBySlug = async (
  username: string,
  slug: string
): Promise<Partial<Place>> => {
  const place = await prisma.place.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
      user: {
        username,
      },
    },
  });

  if (!place) {
    throw new Error(
      "Place not found or you don't have permission to delete it."
    );
  }

  return await prisma.place.delete({
    where: {
      id: place.id,
    },
  });
};

export const updatePlace = async (
  slug: string,
  username: string,
  name?: string,
  description?: string,
  priceMin?: number,
  priceMax?: number,
  city?: string,
  address?: string,
  latitude?: number,
  longitude?: number
): Promise<Partial<Place>> => {
  const place = await prisma.place.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
      user: {
        username,
      },
    },
  });

  if (!place) {
    throw new Error(
      "Place not found or you don't have permission to update it."
    );
  }

  const data = filterValidValues({
    name,
    description,
    priceMin,
    priceMax,
    city,
    address,
    latitude,
    longitude,
  });

  if (city) {
    const citySlug = generateSlug(city);

    data.city = {
      connect: {
        slug: citySlug,
      },
    };
  }

  return await prisma.place.update({
    where: { id: place.id },
    data,
  });
};

export const isPlaceSlugExist = async (slug: string): Promise<boolean> => {
  const place = await prisma.place.findUnique({
    where: {
      slug,
    },
  });

  return place !== null;
};
