import { CitySchema } from '@prisma/generated/zod';
import { z } from 'zod';

export const City = CitySchema;

export const CityParam = z.object({
  slug: z.string().max(255).openapi({ description: 'param: slug | id' }),
});

export const GetCities = City.array();
