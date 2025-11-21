import type { SignInSchema, SignUpSchema } from '@doku-seal/validators';
import type { z } from 'zod';
import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

// Re-export DTOs from validators
export class SignInDto implements z.infer<typeof SignInSchema> {
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsString()
  @MinLength(1, { message: 'Password is required' })
  password: string;
}

export class SignUpDto implements z.infer<typeof SignUpSchema> {
  @IsString()
  @MinLength(1, { message: 'Name is required' })
  name: string;

  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;
}

export class RefreshTokenDto {
  refreshToken: string;
}
