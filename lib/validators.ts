import { z } from 'zod';

export const TubeBenderSchema = z.object({
  id: z.string(),
  brand: z.string(),
  model: z.string(),
  maxCapacity: z.string(),
  clrRange: z.string(),
  dieCost: z.string(),
  cycleTime: z.string(),
  weight: z.string(),
  price: z.string(),
  mandrel: z.enum(['Available', 'Standard', 'No']),
  totalScore: z.number().min(0).max(10),
  imageUrl: z.string().optional(),
  description: z.string().optional(),
});

export type TubeBender = z.infer<typeof TubeBenderSchema>;

export const TubeBenderArraySchema = z.array(TubeBenderSchema);

