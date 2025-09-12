import * as z from 'zod';

export const createSchema = z.object({
  value: z.number(),
  emissionDate: z.iso.date(),
  assignor: z.uuidv4(),
});

export type CreatePayableDto = z.infer<typeof createSchema>;
