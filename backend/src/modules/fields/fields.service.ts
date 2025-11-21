import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import type { PrismaService } from '../../database/prisma.service';
import type { AddFieldDto, UpdateFieldDto } from './dto';
import type { Prisma } from '@prisma/client';

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
      include: {
        envelopeItems: true,
      },
    });

    if (!envelope) {
      throw new NotFoundException('Envelope not found');
    }

    // Cannot add fields if already sent
    if (envelope.status !== 'DRAFT') {
      throw new ForbiddenException('Cannot add fields to envelope that has been sent');
    }

    // Get the first envelope item (or create one if none exists)
    const envelopeItem = envelope.envelopeItems[0];
    if (!envelopeItem) {
      throw new NotFoundException('Envelope must have at least one document item');
    }

    // Verify recipient exists and belongs to this envelope
    const recipient = await this.prisma.recipient.findFirst({
      where: {
        id: parseInt(dto.recipientId, 10),
        envelopeId: dto.envelopeId,
      },
    });

    if (!recipient) {
      throw new NotFoundException('Recipient not found');
    }

    // Create field
    const field = await this.prisma.field.create({
      data: {
        type: dto.type,
        page: dto.pageNumber,
        positionX: dto.pageX,
        positionY: dto.pageY,
        width: dto.pageWidth,
        height: dto.pageHeight,
        customText: '',
        inserted: false,
        recipientId: parseInt(dto.recipientId, 10),
        envelopeId: dto.envelopeId,
        envelopeItemId: envelopeItem.id,
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
        id: parseInt(fieldId, 10),
        envelope: {
          userId,
          teamId,
          deletedAt: null,
        },
      },
      include: {
        envelope: true,
      },
    });

    if (!field) {
      throw new NotFoundException('Field not found');
    }

    // Cannot update if already sent
    if (field.envelope.status !== 'DRAFT') {
      throw new ForbiddenException('Cannot update field after envelope has been sent');
    }

    // If recipientId is being updated, verify the new recipient exists
    if (dto.recipientId) {
      const recipient = await this.prisma.recipient.findFirst({
        where: {
          id: parseInt(dto.recipientId, 10),
          envelopeId: field.envelope.id,
        },
      });

      if (!recipient) {
        throw new NotFoundException('Recipient not found');
      }
    }

    const updateData: Prisma.FieldUpdateInput = {};
    if (dto.recipientId) {
      updateData.recipient = {
        connect: {
          id: parseInt(dto.recipientId, 10),
        },
      };
    }
    if (dto.type) {
      updateData.type = dto.type;
    }
    if (dto.pageNumber !== undefined) {
      updateData.page = dto.pageNumber;
    }
    if (dto.pageX !== undefined) {
      updateData.positionX = dto.pageX;
    }
    if (dto.pageY !== undefined) {
      updateData.positionY = dto.pageY;
    }
    if (dto.pageWidth !== undefined) {
      updateData.width = dto.pageWidth;
    }
    if (dto.pageHeight !== undefined) {
      updateData.height = dto.pageHeight;
    }

    const updated = await this.prisma.field.update({
      where: { id: parseInt(fieldId, 10) },
      data: updateData,
    });

    return updated;
  }

  /**
   * Remove a field from an envelope
   */
  async remove(fieldId: string, userId: number, teamId: number) {
    const field = await this.prisma.field.findFirst({
      where: {
        id: parseInt(fieldId, 10),
        envelope: {
          userId,
          teamId,
          deletedAt: null,
        },
      },
      include: {
        envelope: true,
      },
    });

    if (!field) {
      throw new NotFoundException('Field not found');
    }

    // Cannot remove if already sent
    if (field.envelope.status !== 'DRAFT') {
      throw new ForbiddenException('Cannot remove field after envelope has been sent');
    }

    await this.prisma.field.delete({
      where: { id: parseInt(fieldId, 10) },
    });

    return { message: 'Field removed successfully' };
  }
}
