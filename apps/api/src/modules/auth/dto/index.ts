import { SignInSchema, SignUpSchema } from '@doku-seal/validators';
import { z } from 'zod';

// Re-export DTOs from validators
export class SignInDto implements z.infer<typeof SignInSchema> {
  email: string;
  password: string;
}

export class SignUpDto implements z.infer<typeof SignUpSchema> {
  email: string;
  password: string;
  name: string;
}

export class RefreshTokenDto {
  refreshToken: string;
}
