import { z } from 'zod';

// Sign In
export const SignInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type SignInDto = z.infer<typeof SignInSchema>;

// Sign Up
export const SignUpSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

export type SignUpDto = z.infer<typeof SignUpSchema>;

// Reset Password
export const RequestResetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type RequestResetPasswordDto = z.infer<typeof RequestResetPasswordSchema>;

// Change Password
export const ChangePasswordSchema = z.object({
  token: z.string(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

export type ChangePasswordDto = z.infer<typeof ChangePasswordSchema>;

// Update Profile
export const UpdateProfileSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  email: z.string().email().optional(),
});

export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;
