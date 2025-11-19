import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AddRecipientDto, UpdateRecipientDto } from './dto';
import { nanoid } from 'nanoid';

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

    // Create recipient
    const recipient = await this.prisma.recipient.create({
      data: {
        id: nanoid(),
        email: dto.email,
        name: dto.name,
        role: dto.role,
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
        id: recipientId,
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
      where: { id: recipientId },
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
        id: recipientId,
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
      where: { id: recipientId },
    });

    return { message: 'Recipient removed successfully' };
  }
}
