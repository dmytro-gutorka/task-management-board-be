import { z } from 'zod';

export const CursorPaginationSchema = z.strictObject({
  cursor: z.string().optional(),
  limit: z.coerce
    .number(`'limit' should be a number`)
    .min(1, `Min 'limit' value is 1`)
    .max(50, `Max 'limit' value is 50`)
    .default(10)
    .optional(),
});
