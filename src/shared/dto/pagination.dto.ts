import { z } from 'zod';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? Number(val) : undefined))
    .refine((val) => val === undefined || Number.isInteger(val), {
      error: 'page must be an integer',
    })
    .refine((val) => val === undefined || val >= 1, {
      error: 'page must be >= 1',
    })
    .default(1),
  limit: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? Number(val) : undefined))
    .refine((val) => val === undefined || Number.isInteger(val), {
      error: 'limit must be an integer',
    })
    .refine((val) => val === undefined || (val >= 1 && val <= 100), {
      error: 'limit must be between 1 and 100',
    })
    .default(10),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(SortOrder).optional().default(SortOrder.DESC),
  search: z.string().optional(),
});

export type PaginationDto = z.infer<typeof paginationSchema>;
