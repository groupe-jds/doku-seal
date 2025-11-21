import type { AddFieldSchema, UpdateFieldSchema } from '@doku-seal/validators';
import type { z } from 'zod';

export class AddFieldDto implements z.infer<typeof AddFieldSchema> {
  envelopeId: string;
  recipientId: string;
  type: 'SIGNATURE' | 'INITIALS' | 'NAME' | 'EMAIL' | 'DATE' | 'TEXT' | 'NUMBER';
  pageNumber: number;
  pageX: number;
  pageY: number;
  pageWidth: number;
  pageHeight: number;
  required?: boolean;
}

export class UpdateFieldDto implements z.infer<typeof UpdateFieldSchema> {
  recipientId?: string;
  type?: 'SIGNATURE' | 'INITIALS' | 'NAME' | 'EMAIL' | 'DATE' | 'TEXT' | 'NUMBER';
  pageNumber?: number;
  pageX?: number;
  pageY?: number;
  pageWidth?: number;
  pageHeight?: number;
  required?: boolean;
}
