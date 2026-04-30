import type { ZodType } from 'zod';
import { validateRequestMiddleware } from './validate-request.middleware.js';

export const validateQueryMiddleware = (QuerySchema: ZodType) =>
  validateRequestMiddleware({ query: QuerySchema });
