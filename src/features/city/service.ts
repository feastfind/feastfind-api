import { City } from '@prisma/generated/zod';
import prisma from '@/lib/db';

export const getCities = async (): Promise<City[]> => {
  return await prisma.city.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getCityByParam = async (param: string): Promise<City | null> => {
  return await prisma.city.findFirst({
    where: {
      OR: [{ slug: param }, { id: param }],
    },
    include: {
      places: true,
    },
  });
};

export const isCitySlugExist = async (slug: string): Promise<boolean> => {
  const city = await prisma.city.findUnique({
    where: {
      slug,
    },
  });

  return city !== null;
};

export const createCity = async (
  slug: string,
  name: string,
  latitude: number,
  longitude: number
): Promise<City> => {
  return await prisma.city.create({
    data: {
      slug: slug,
      name,
      latitude,
      longitude,
    },
  });
};
