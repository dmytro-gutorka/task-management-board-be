import z from 'zod';

export const SetLocalPasswordSchema = z
  .strictObject({
    password: z.string().min(6, 'Min password length is 6'),
    confirmPassword: z.string().min(6, 'Min password length is 6'),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
