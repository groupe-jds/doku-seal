import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import type { PrismaService } from '../../database/prisma.service';
import type { AddRecipientDto, UpdateRecipientDto } from './dto';
import * as crypto from 'crypto';

@Injectable()
export class RecipientsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Add a recipient to an envelope
   */
  async add(userId: number, teamId: number, dto: AddRecipientDto) {
    // Check if envelope exists and belongs to user
    const envelope = await this.prisma.envelope.findFirst({
      where: {
        id: dto.envelopeId,
        userId,
        teamId,
        deletedAt: null,
      },
      include: {
        recipients: true,
        documentMeta: true,
      },
    });

    if (!envelope) {
      throw new NotFoundException('Envelope not found');
    }

    // Cannot add recipients if already sent
    if (envelope.status !== 'DRAFT') {
      throw new ForbiddenException('Cannot add recipients to envelope that has been sent');
    }

    // Generate token for recipient
    const token = crypto.randomBytes(32).toString('hex');

    // Create recipient
    const recipient = await this.prisma.recipient.create({
      data: {
        email: dto.email,
        name: dto.name,
        role: dto.role,
        token,
        envelopeId: dto.envelopeId,
        signingOrder:
          envelope.documentMeta.signingOrder === 'SEQUENTIAL'
            ? envelope.recipients.length + 1
            : null,
      },
    });

    return recipient;
  }

  /**
   * Update a recipient
   */
  async update(recipientId: string, userId: number, teamId: number, dto: UpdateRecipientDto) {
    const recipient = await this.prisma.recipient.findFirst({
      where: {
        id: parseInt(recipientId, 10),
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

    if (!recipient) {
      throw new NotFoundException('Recipient not found');
    }

    // Cannot update if already sent
    if (recipient.envelope.status !== 'DRAFT') {
      throw new ForbiddenException('Cannot update recipient after envelope has been sent');
    }

    const updated = await this.prisma.recipient.update({
      where: { id: parseInt(recipientId, 10) },
      data: {
        name: dto.name,
        role: dto.role,
      },
    });

    return updated;
  }

  /**
   * Remove a recipient from an envelope
   */
  async remove(recipientId: string, userId: number, teamId: number) {
    const recipient = await this.prisma.recipient.findFirst({
      where: {
        id: parseInt(recipientId, 10),
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

    if (!recipient) {
      throw new NotFoundException('Recipient not found');
    }

    // Cannot remove if already sent
    if (recipient.envelope.status !== 'DRAFT') {
      throw new ForbiddenException('Cannot remove recipient after envelope has been sent');
    }

    await this.prisma.recipient.delete({
      where: { id: parseInt(recipientId, 10) },
    });

    return { message: 'Recipient removed successfully' };
  }
}
