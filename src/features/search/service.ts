import { z } from 'zod';

export const querySchema = z.object({
  q: z.string().min(1),
});
