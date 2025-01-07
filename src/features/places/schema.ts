import { z } from 'zod';
import { PlaceSchema } from '../../../prisma/generated/zod';

const PriceSchema = z.string().refine((val) => Number(val));

export const GetPlacesSchema = z.object({
  count: z.number(),
  places: PlaceSchema.extend({
    priceMin: PriceSchema,
    priceMax: PriceSchema,
  }).array(),
});

export const GetPlacesBySlugSchema = PlaceSchema.extend({
  priceMin: PriceSchema,
  priceMax: PriceSchema,
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

export const UpdatePlaceRequestParamSchema = z.object({
  slug: z.string().max(255).openapi({ description: 'param: slug | id' }),
});

export const UpdatePlaceRequestBodySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});
