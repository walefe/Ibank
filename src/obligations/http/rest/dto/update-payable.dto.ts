import { z } from 'zod';

export const updatePayableSchema = z.object({
  value: z.number().optional(),
  emissionDate: z.iso.date().optional(),
  assignorId: z.uuidv4().optional(),
});

export type UpdatePayableDto = z.infer<typeof updatePayableSchema>;
