import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AddFieldDto, UpdateFieldDto } from './dto';
import { nanoid } from 'nanoid';

@Injectable()
export class FieldsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Add a field to an envelope
   */
  async add(userId: number, teamId: number, dto: AddFieldDto) {
    // Check if envelope exists and belongs to user
    const envelope = await this.prisma.envelope.findFirst({
      where: {
        id: dto.envelopeId,
        userId,
        teamId,
        deletedAt: null,
      },
    });

    if (!envelope) {
      throw new NotFoundException('Envelope not found');
    }

    // Cannot add fields if already sent
    if (envelope.status !== 'DRAFT') {
      throw new ForbiddenException('Cannot add fields to envelope that has been sent');
    }

    // Verify recipient exists and belongs to this envelope
    const recipient = await this.prisma.recipient.findFirst({
      where: {
        id: dto.recipientId,
        envelopeId: dto.envelopeId,
      },
    });

    if (!recipient) {
      throw new NotFoundException('Recipient not found');
    }

    // Create field
    const field = await this.prisma.field.create({
      data: {
        id: nanoid(),
        type: dto.type,
        pageNumber: dto.pageNumber,
        pageX: dto.pageX,
        pageY: dto.pageY,
        pageWidth: dto.pageWidth,
        pageHeight: dto.pageHeight,
        required: dto.required ?? true,
        recipientId: dto.recipientId,
        documentId: envelope.documentId,
      },
    });

    return field;
  }

  /**
   * Update a field
   */
  async update(fieldId: string, userId: number, teamId: number, dto: UpdateFieldDto) {
    const field = await this.prisma.field.findFirst({
      where: {
        id: fieldId,
        document: {
          envelopes: {
            some: {
              userId,
              teamId,
              deletedAt: null,
            },
          },
        },
      },
      include: {
        document: {
          include: {
            envelopes: true,
          },
        },
      },
    });

    if (!field) {
      throw new NotFoundException('Field not found');
    }

    // Cannot update if already sent
    const envelope = field.document.envelopes[0];
    if (envelope?.status !== 'DRAFT') {
      throw new ForbiddenException('Cannot update field after envelope has been sent');
    }

    // If recipientId is being updated, verify the new recipient exists
    if (dto.recipientId) {
      const recipient = await this.prisma.recipient.findFirst({
        where: {
          id: dto.recipientId,
          envelopeId: envelope.id,
        },
      });

      if (!recipient) {
        throw new NotFoundException('Recipient not found');
      }
    }

    const updated = await this.prisma.field.update({
      where: { id: fieldId },
      data: {
        recipientId: dto.recipientId,
        type: dto.type,
        pageNumber: dto.pageNumber,
        pageX: dto.pageX,
        pageY: dto.pageY,
        pageWidth: dto.pageWidth,
        pageHeight: dto.pageHeight,
        required: dto.required,
      },
    });

    return updated;
  }

  /**
   * Remove a field from an envelope
   */
  async remove(fieldId: string, userId: number, teamId: number) {
    const field = await this.prisma.field.findFirst({
      where: {
        id: fieldId,
        document: {
          envelopes: {
            some: {
              userId,
              teamId,
              deletedAt: null,
            },
          },
        },
      },
      include: {
        document: {
          include: {
            envelopes: true,
          },
        },
      },
    });

    if (!field) {
      throw new NotFoundException('Field not found');
    }

    // Cannot remove if already sent
    const envelope = field.document.envelopes[0];
    if (envelope?.status !== 'DRAFT') {
      throw new ForbiddenException('Cannot remove field after envelope has been sent');
    }

    await this.prisma.field.delete({
      where: { id: fieldId },
    });

    return { message: 'Field removed successfully' };
  }
}
