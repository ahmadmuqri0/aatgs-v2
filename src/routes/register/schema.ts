import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string('Please enter your full name').min(3),
    email: z.email(),
    password: z.string('Please enter your password').min(8),
    confirm: z.string('Please confirm your password'),
    rememberMe: z.boolean().default(true)
  })
  .refine((data) => data.password === data.confirm, {
    error: 'Password do not match',
    path: ['confirm']
  });
