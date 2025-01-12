import { MenuItemSchema, PlaceSchema } from '@prisma/generated/zod';
import { z } from 'zod';

const Price = z.string().refine((val) => Number(val));

export const Place = PlaceSchema.extend({
  priceMin: Price,
  priceMax: Price,
});

export const PlaceWithImages = Place.extend({
  images: z.string().array(),
});

export const PlacesParam = z.object({
  slug: z.string().max(255).openapi({ description: 'param: slug | id' }),
});

export const PlaceResponse = z.object({
  message: z.string(),
  place: Place,
});

export const PlacesArray = PlaceWithImages.array();

export const GetPlaceDetail = PlaceSchema.extend({
  menuItems: MenuItemSchema.extend({
    images: z.string().array(),
  }).array(),
});

export const CreatePlace = z.object({
  name: z.string(),
  description: z.string().optional(),
  priceMin: z.number(),
  priceMax: z.number(),
  city: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

export const UpdatePlace = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});
