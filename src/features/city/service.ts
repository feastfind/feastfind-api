import { City } from '../../../prisma/generated/zod';
import prisma from '../../lib/db';

export const getCities = async (): Promise<City[]> => {
  return await prisma.city.findMany();
};

export const getCityByParam = async (param: string): Promise<City | null> => {
  const isCUID = /^[a-z0-9]{25}$/.test(param);

  if (isCUID) {
    return await prisma.city.findUnique({
      where: {
        id: param,
      },
    });
  }

  return await prisma.city.findFirst({
    where: {
      OR: [{ slug: param }, { id: param }],
    },
  });
};
