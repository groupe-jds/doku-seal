import { z } from 'zod';

export const RequestPasswordResetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type RequestPasswordResetDto = z.infer<typeof RequestPasswordResetSchema>;

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Must contain uppercase, lowercase, and number'
    ),
});

export type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>;
