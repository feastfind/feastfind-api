import { City } from '../../../prisma/generated/zod';
import prisma from '../../lib/db';

export const getCities = async (): Promise<{
  cities: City[];
  count: number;
}> => {
  const cities = await prisma.city.findMany();
  const count = await prisma.city.count();

  return { cities, count };
};

export const getCityByParam = async (param: string): Promise<City | null> => {
  return await prisma.city.findFirst({
    where: {
      OR: [{ slug: param }, { id: param }],
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
