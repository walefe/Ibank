import { z } from 'zod';

export const createPayableSchema = z.object({
  value: z.number(),
  emissionDate: z.iso.date(),
  assignorId: z.uuidv4(),
});

export type CreatePayableDto = z.infer<typeof createPayableSchema>;
