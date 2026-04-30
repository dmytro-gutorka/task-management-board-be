import type { ZodType } from 'zod';

/** Which request sections can be validated? */
export type ValidationField = 'body' | 'params' | 'query';

/** Config for one or many request sections. */
export type ValidationConfig = Partial<Record<ValidationField, ZodType>>;
