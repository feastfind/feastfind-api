import { z } from 'zod';
import { PlaceSchema } from '../../../prisma/generated/zod';

export const GetPlacesSchema = z.object({
  count: z.number(),
  place: PlaceSchema.extend({
    priceMin: z.string().refine((val) => Number(val)),
    priceMax: z.string().refine((val) => Number(val)),
  }).array(),
});

export const GetPlacesBySlugSchema = PlaceSchema.extend({
  priceMin: z.string().refine((val) => Number(val)),
  priceMax: z.string().refine((val) => Number(val)),
});

export const GetPlacesBySlugRequestSchema = z.object({
  slug: z.string().max(255).openapi({ description: 'param: slug | id' }),
});

export const CreatePlaceSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  priceMin: z.number(),
  priceMax: z.number(),
  city: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

export const DeletePlaceRequestSchema = z.object({
  slug: z.string().max(255).openapi({ description: 'param: slug | id' }),
});

export const DeletePlaceResponseSchema = z.object({
  message: z.string(),
  place: PlaceSchema,
});
