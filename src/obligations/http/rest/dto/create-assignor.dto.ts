import { z } from 'zod';

export const createAssignorSchema = z.object({
  name: z.string(),
  document: z.string(),
  email: z.email(),
  phone: z.string(),
});

export type CreateAssignorDto = z.infer<typeof createAssignorSchema>;
