import type { infer as ZodInfer } from 'zod';
import type { EnvFileSchema } from './env.schema.js';

export type EnvFile = ZodInfer<typeof EnvFileSchema>;
