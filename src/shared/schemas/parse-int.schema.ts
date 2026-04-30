import { z } from 'zod';

export const createParseIntSchema = (key: string) =>
  z.object({
    [key]: z.coerce
      .number(`${key} must be a number`)
      .int(`${key} must be an integer`)
      .positive(`${key} must be a positive number`),
  });
