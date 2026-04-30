import { z } from 'zod';

export const PaginationSchema = z.strictObject({
  page: z.coerce
    .number(`'page' should be a number`)
    .min(1, `Min 'page' value is 1`)
    .default(1)
    .optional(),
  perPage: z.coerce
    .number(`'perPage' should be a number`)
    .min(1, `Min 'perPage' value is 1`)
    .default(20)
    .optional(),
});
