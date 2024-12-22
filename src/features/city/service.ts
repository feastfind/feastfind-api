import { City } from '../../../prisma/generated/zod';
import prisma from '../../lib/db';
import { isValidCUID } from '../../utils/regex';

export const getCities = async (): Promise<City[]> => {
  return await prisma.city.findMany();
};

export const getCityByParam = async (param: string): Promise<City | null> => {
  const isCUID = isValidCUID(param);

  return await prisma.city.findUnique({
    where: isCUID ? { id: param } : { slug: param },
  });
};
