import type { ZodType } from 'zod';
import { validateRequestMiddleware } from './validate-request.middleware.js';

export const validateBodyMiddleware = (BodySchema: ZodType) =>
  validateRequestMiddleware({ body: BodySchema });
