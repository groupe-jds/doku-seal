import { AddRecipientSchema } from '@doku-seal/validators';
import { z } from 'zod';

export class AddRecipientDto implements z.infer<typeof AddRecipientSchema> {
  envelopeId: string;
  email: string;
  name: string;
  role: 'SIGNER' | 'VIEWER' | 'APPROVER' | 'CC';
}

export class UpdateRecipientDto {
  name?: string;
  role?: 'SIGNER' | 'VIEWER' | 'APPROVER' | 'CC';
}
