import { Place } from '../../../prisma/generated/zod';
import prisma from '../../lib/db';
import { isValidCUID } from '../../utils/regex';

export const getPlaces = async (): Promise<Place[]> => {
  return await prisma.place.findMany();
};

export const getPlaceByParam = async (param: string): Promise<Place | null> => {
  const isCUID = isValidCUID(param);

  return await prisma.place.findUnique({
    where: isCUID ? { id: param } : { slug: param },
  });
};

// export const createPlace = async (
//   name: string,
//   description: string,
//   priceMin: number,
//   priceMax: number,
//   city: string,
//   address: string,
// ): Promise<Partial<Place>> => {
//   const coordinate = await getCoordinate(city, address);

//   if (!coordinate) {
//     throw new Error('Failed to get coordinate');
//   }

//   const { lat, lon } = coordinate;

//   // generate slug
//   // create city -> validate city name (getLoc?)

//   const newPlace = await prisma.place.create({
//     data: {
//       slug,
//       name,
//       description,
//       priceMin,
//       priceMax,
//       address,
//       latitude: lat,
//       longitude: lon,
//     },

//   });

// };
