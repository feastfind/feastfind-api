import { City } from '../../../prisma/generated/zod';
import prisma from '../../lib/db';

export const getCities = async (): Promise<City[]> => {
  return await prisma.city.findMany();
};

export const getCityBySlug = async (slug: string): Promise<City | null> => {
  return await prisma.city.findUnique({
    where: {
      slug,
    },
  })
}