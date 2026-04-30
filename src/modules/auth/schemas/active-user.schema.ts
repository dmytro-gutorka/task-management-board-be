import { z } from 'zod';
import { AuthProvider } from '../enums/auth-provider.enum.js';

export const ActiveUserSchema = z.object({
  id: z.number(),
  email: z.email(),
  provider: z.enum(AuthProvider),
});
