import { z } from 'zod';

export const PaginationSchema = z.strictObject({
  cursor: z.string().optional(),

  limit: z.coerce
    .number(`'limit' should be a number`)
    .min(1, `Min 'limit' value is 1`)
    .max(100, `Max 'limit' value is 100`)
    .default(10)
    .optional(),
});
