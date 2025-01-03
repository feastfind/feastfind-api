import { z } from 'zod';
import { CitySchema } from '../../../prisma/generated/zod';

export const GetCitiesSchema = z.object({
  count: z.number(),
  cities: CitySchema.array(),
});

export const GetCitiesBySlugRequestSchema = z.object({
  slug: z.string().max(255).openapi({ description: 'param: slug | id' }),
});

export const GetCitiesBySlugSchema = CitySchema;