import { z } from 'zod';

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