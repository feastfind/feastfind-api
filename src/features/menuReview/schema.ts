import { MenuItemReviewSchema } from '@prisma/generated/zod';
import { z } from 'zod';

export const Review = MenuItemReviewSchema;

export const ReviewParam = z.object({
  slug: z.string().max(255).openapi({ description: 'param: slug | id' }),
});

export const ReviewResponse = z.object({
  message: z.string(),
  menuItemReview: Review,
});

export const GetReviews = Review.array();

export const CreateReview = z.object({
  rating: z.number(),
  comment: z.string().optional(),
});

export const UpdateReview = z.object({
  rating: z.number().optional(),
  comment: z.string().optional(),
});
