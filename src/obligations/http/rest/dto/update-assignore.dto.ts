import { z } from 'zod';

export const updateAssignorSchema = z.object({
  name: z.string().optional(),
  document: z.string().optional(),
  email: z.email().optional(),
  phone: z.string().optional(),
});

export type UpdateAssignorDto = z.infer<typeof updateAssignorSchema>;
