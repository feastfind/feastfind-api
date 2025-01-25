import { PlaceSchema } from '@prisma/generated/zod';
import { z } from 'zod';

const Price = z.string().refine((val) => Number(val));

export const Place = PlaceSchema.extend({
  priceMin: Price,
  priceMax: Price,
});

export const PlaceWithImages = Place.extend({
  images: z.string().array(),
});
