import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email(),
  password: z.string('Please enter your password').min(8),
  rememberMe: z.boolean().default(true)
});
