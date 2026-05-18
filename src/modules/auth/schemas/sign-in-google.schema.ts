import { z } from 'zod';

export const SignInGoogleSchema = z.strictObject({
  credential: z.string().min(1, 'Google credential is required'),
});
