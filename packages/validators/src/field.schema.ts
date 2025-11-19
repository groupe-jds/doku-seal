import { z } from 'zod';

export const FieldTypeEnum = z.enum([
  'SIGNATURE',
  'INITIALS',
  'NAME',
  'EMAIL',
  'DATE',
  'TEXT',
  'NUMBER',
]);

export const AddFieldSchema = z.object({
  envelopeId: z.string().min(1, 'Envelope ID is required'),
  recipientId: z.string().min(1, 'Recipient ID is required'),
  type: FieldTypeEnum,
  pageNumber: z.number().int().min(1, 'Page number must be at least 1'),
  pageX: z.number().min(0, 'X coordinate must be non-negative'),
  pageY: z.number().min(0, 'Y coordinate must be non-negative'),
  pageWidth: z.number().min(1, 'Width must be at least 1'),
  pageHeight: z.number().min(1, 'Height must be at least 1'),
  required: z.boolean().optional().default(true),
});

export const UpdateFieldSchema = z.object({
  recipientId: z.string().min(1).optional(),
  type: FieldTypeEnum.optional(),
  pageNumber: z.number().int().min(1).optional(),
  pageX: z.number().min(0).optional(),
  pageY: z.number().min(0).optional(),
  pageWidth: z.number().min(1).optional(),
  pageHeight: z.number().min(1).optional(),
  required: z.boolean().optional(),
});

export type AddFieldDto = z.infer<typeof AddFieldSchema>;
export type UpdateFieldDto = z.infer<typeof UpdateFieldSchema>;
