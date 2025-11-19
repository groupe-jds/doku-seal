import { z } from 'zod';

// Document/Envelope enums
export const DocumentStatusSchema = z.enum([
  'DRAFT',
  'PENDING',
  'COMPLETED',
  'ARCHIVED',
]);

export const DocumentVisibilitySchema = z.enum(['EVERYONE', 'TEAM', 'MANAGER_AND_ABOVE']);

export const DocumentSigningOrderSchema = z.enum(['PARALLEL', 'SEQUENTIAL']);

export const DocumentDistributionMethodSchema = z.enum(['EMAIL', 'NONE']);

export const TemplateTypeSchema = z.enum(['PRIVATE', 'PUBLIC']);

// Create Document/Envelope
export const CreateEnvelopeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  externalId: z.string().optional(),
  visibility: DocumentVisibilitySchema.default('EVERYONE'),
  recipients: z
    .array(
      z.object({
        email: z.string().email('Invalid recipient email'),
        name: z.string().min(1, 'Recipient name is required'),
        role: z.enum(['SIGNER', 'VIEWER', 'APPROVER', 'CC']),
      })
    )
    .min(1, 'At least one recipient is required'),
  subject: z.string().optional(),
  message: z.string().optional(),
  redirectUrl: z.string().url('Invalid redirect URL').optional(),
  signingOrder: DocumentSigningOrderSchema.default('PARALLEL'),
  distributionMethod: DocumentDistributionMethodSchema.default('EMAIL'),
  folderId: z.string().optional(),
});

export type CreateEnvelopeDto = z.infer<typeof CreateEnvelopeSchema>;

// Update Document/Envelope
export const UpdateEnvelopeSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  visibility: DocumentVisibilitySchema.optional(),
  subject: z.string().optional(),
  message: z.string().optional(),
  redirectUrl: z.string().url().optional(),
  folderId: z.string().optional(),
});

export type UpdateEnvelopeDto = z.infer<typeof UpdateEnvelopeSchema>;

// Add Recipient
export const AddRecipientSchema = z.object({
  envelopeId: z.string(),
  email: z.string().email('Invalid email'),
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['SIGNER', 'VIEWER', 'APPROVER', 'CC']),
});

export type AddRecipientDto = z.infer<typeof AddRecipientSchema>;

// Add Field to Document
export const AddFieldSchema = z.object({
  envelopeId: z.string(),
  recipientId: z.string(),
  type: z.enum(['SIGNATURE', 'TEXT', 'DATE', 'EMAIL', 'NAME', 'NUMBER', 'CHECKBOX', 'DROPDOWN', 'RADIO']),
  pageNumber: z.number().int().positive(),
  pageX: z.number().min(0).max(1),
  pageY: z.number().min(0).max(1),
  pageWidth: z.number().positive(),
  pageHeight: z.number().positive(),
  required: z.boolean().default(true),
});

export type AddFieldDto = z.infer<typeof AddFieldSchema>;

// Send Document
export const SendEnvelopeSchema = z.object({
  envelopeId: z.string(),
});

export type SendEnvelopeDto = z.infer<typeof SendEnvelopeSchema>;

// List Documents Query
export const ListEnvelopesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: DocumentStatusSchema.optional(),
  folderId: z.string().optional(),
  search: z.string().optional(),
});

export type ListEnvelopesDto = z.infer<typeof ListEnvelopesSchema>;

// Resend Document
export const ResendEnvelopeSchema = z.object({
  envelopeId: z.string(),
  recipientIds: z.array(z.string()).min(1, 'At least one recipient is required'),
});

export type ResendEnvelopeDto = z.infer<typeof ResendEnvelopeSchema>;
