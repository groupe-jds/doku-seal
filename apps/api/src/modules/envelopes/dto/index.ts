import {
  CreateEnvelopeSchema,
  UpdateEnvelopeSchema,
  SendEnvelopeSchema,
  ListEnvelopesSchema,
} from '@doku-seal/validators';
import { z } from 'zod';

// DTOs from validators
export class CreateEnvelopeDto implements z.infer<typeof CreateEnvelopeSchema> {
  title: string;
  externalId?: string;
  visibility: 'EVERYONE' | 'TEAM' | 'MANAGER_AND_ABOVE';
  recipients: Array<{
    email: string;
    name: string;
    role: 'SIGNER' | 'VIEWER' | 'APPROVER' | 'CC';
  }>;
  subject?: string;
  message?: string;
  redirectUrl?: string;
  signingOrder: 'PARALLEL' | 'SEQUENTIAL';
  distributionMethod: 'EMAIL' | 'NONE';
  folderId?: string;
}

export class UpdateEnvelopeDto implements z.infer<typeof UpdateEnvelopeSchema> {
  title?: string;
  visibility?: 'EVERYONE' | 'TEAM' | 'MANAGER_AND_ABOVE';
  subject?: string;
  message?: string;
  redirectUrl?: string;
  folderId?: string;
}

export class SendEnvelopeDto implements z.infer<typeof SendEnvelopeSchema> {
  envelopeId: string;
}

export class ListEnvelopesDto implements z.infer<typeof ListEnvelopesSchema> {
  page: number;
  limit: number;
  status?: 'DRAFT' | 'PENDING' | 'COMPLETED' | 'ARCHIVED';
  folderId?: string;
  search?: string;
}
