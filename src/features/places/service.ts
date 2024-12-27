import { Place } from '../../../prisma/generated/zod';
import prisma from '../../lib/db';
import { generateSlug } from '../../utils/slug';
import { createCity, isCitySlugExist } from '../city/service';

export const getPlaces = async (): Promise<Place[]> => {
  return await prisma.place.findMany();
};

export const getPlaceByParam = async (param: string): Promise<Place | null> => {
  return await prisma.place.findFirst({
    where: {
      OR: [{ id: param }, { slug: param }],
    },
  });
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

export const isPlaceSlugExist = async (slug: string): Promise<boolean> => {
  const place = await prisma.place.findUnique({
    where: {
      slug,
    },
  });

  return place !== null;
};
