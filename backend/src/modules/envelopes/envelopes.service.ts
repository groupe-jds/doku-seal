import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import type { PrismaService } from '../../database/prisma.service';
import type { CreateEnvelopeDto, UpdateEnvelopeDto, ListEnvelopesDto } from './dto';
import { nanoid } from 'nanoid';
import type { Prisma } from '@prisma/client';

@Injectable()
export class EnvelopesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new envelope (document)
   */
  async create(userId: number, teamId: number, dto: CreateEnvelopeDto) {
    // Generate unique IDs
    const envelopeId = nanoid();
    const secondaryId = nanoid();
    const documentMetaId = nanoid();

    // Create envelope with meta and recipients
    const envelopeData: Prisma.EnvelopeCreateInput = {
      id: envelopeId,
      secondaryId,
      externalId: dto.externalId,
      title: dto.title,
      status: 'DRAFT' as const,
      source: 'DOCUMENT' as const,
      type: 'DOCUMENT' as const,
      visibility: dto.visibility,
      internalVersion: 1,
      user: {
        connect: {
          id: userId,
        },
      },
      team: {
        connect: {
          id: teamId,
        },
      },
      documentMeta: {
        create: {
          id: documentMetaId,
          subject: dto.subject,
          message: dto.message,
          redirectUrl: dto.redirectUrl,
          signingOrder: dto.signingOrder,
          distributionMethod: dto.distributionMethod,
        },
      },
      recipients: {
        create: dto.recipients.map((recipient, index) => ({
          email: recipient.email,
          name: recipient.name,
          role: recipient.role,
          token: nanoid(32),
          signingOrder: dto.signingOrder === 'SEQUENTIAL' ? index + 1 : null,
        })),
      },
      ...(dto.folderId && {
        folder: {
          connect: {
            id: dto.folderId,
          },
        },
      }),
    };

    const envelope = await this.prisma.envelope.create({
      data: envelopeData,
      include: {
        recipients: true,
        documentMeta: true,
      },
    });

    return envelope;
  }

  /**
   * Get all envelopes for a user/team with pagination
   */
  async findAll(userId: number, teamId: number, dto: ListEnvelopesDto) {
    const { page, limit, status, folderId, search } = dto;
    const skip = (page - 1) * limit;

    const where: Prisma.EnvelopeWhereInput = {
      userId,
      teamId,
      deletedAt: null,
    };

    if (status) {
      // Filter out ARCHIVED as it's not in Prisma schema (only DRAFT, PENDING, COMPLETED, REJECTED)
      if (status !== 'ARCHIVED') {
        where.status = status as 'DRAFT' | 'PENDING' | 'COMPLETED' | 'REJECTED';
      }
    }

    if (folderId) {
      where.folderId = folderId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { recipients: { some: { email: { contains: search, mode: 'insensitive' } } } },
        { recipients: { some: { name: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    const [envelopes, total] = await Promise.all([
      this.prisma.envelope.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          recipients: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              signedAt: true,
            },
          },
          documentMeta: {
            select: {
              subject: true,
              signingOrder: true,
            },
          },
          _count: {
            select: {
              fields: true,
            },
          },
        },
      }),
      this.prisma.envelope.count({ where }),
    ]);

    return {
      data: envelopes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single envelope by ID
   */
  async findOne(envelopeId: string, userId: number, teamId: number) {
    const envelope = await this.prisma.envelope.findFirst({
      where: {
        id: envelopeId,
        userId,
        teamId,
        deletedAt: null,
      },
      include: {
        recipients: {
          orderBy: { signingOrder: 'asc' },
        },
        fields: {
          include: {
            recipient: {
              select: {
                id: true,
                email: true,
                name: true,
                role: true,
              },
            },
          },
        },
        documentMeta: true,
        envelopeItems: {
          include: {
            documentData: true,
          },
        },
      },
    });

    if (!envelope) {
      throw new NotFoundException('Envelope not found');
    }

    return envelope;
  }

  /**
   * Update an envelope
   */
  async update(envelopeId: string, userId: number, teamId: number, dto: UpdateEnvelopeDto) {
    // Check if envelope exists and belongs to user
    const existing = await this.prisma.envelope.findFirst({
      where: {
        id: envelopeId,
        userId,
        teamId,
        deletedAt: null,
      },
    });

    if (!existing) {
      throw new NotFoundException('Envelope not found');
    }

    // Cannot update if already sent
    if (existing.status !== 'DRAFT') {
      throw new ForbiddenException('Cannot update envelope that has been sent');
    }

    const updateData: Prisma.EnvelopeUpdateInput = {};
    if (dto.title) {
      updateData.title = dto.title;
    }
    if (dto.visibility) {
      updateData.visibility = dto.visibility;
    }

    // Handle folder relation
    if (dto.folderId !== undefined) {
      if (dto.folderId) {
        updateData.folder = {
          connect: {
            id: dto.folderId,
          },
        };
      } else {
        updateData.folder = {
          disconnect: true,
        };
      }
    }

    const documentMetaUpdate: Prisma.DocumentMetaUpdateInput = {};
    if (dto.subject !== undefined) {
      documentMetaUpdate.subject = dto.subject;
    }
    if (dto.message !== undefined) {
      documentMetaUpdate.message = dto.message;
    }
    if (dto.redirectUrl !== undefined) {
      documentMetaUpdate.redirectUrl = dto.redirectUrl;
    }

    if (Object.keys(documentMetaUpdate).length > 0) {
      updateData.documentMeta = {
        update: documentMetaUpdate,
      };
    }

    const envelope = await this.prisma.envelope.update({
      where: { id: envelopeId },
      data: updateData,
      include: {
        recipients: true,
        documentMeta: true,
      },
    });

    return envelope;
  }

  /**
   * Delete an envelope (soft delete)
   */
  async remove(envelopeId: string, userId: number, teamId: number) {
    const existing = await this.prisma.envelope.findFirst({
      where: {
        id: envelopeId,
        userId,
        teamId,
        deletedAt: null,
      },
    });

    if (!existing) {
      throw new NotFoundException('Envelope not found');
    }

    await this.prisma.envelope.update({
      where: { id: envelopeId },
      data: { deletedAt: new Date() },
    });

    return { message: 'Envelope deleted successfully' };
  }

  /**
   * Upload a document to an envelope
   */
  async uploadDocument(
    envelopeId: string,
    userId: number,
    teamId: number,
    file: Express.Multer.File,
  ) {
    // Check if envelope exists and belongs to user
    const envelope = await this.prisma.envelope.findFirst({
      where: {
        id: envelopeId,
        userId,
        teamId,
        deletedAt: null,
      },
    });

    if (!envelope) {
      throw new NotFoundException('Envelope not found');
    }

    // Cannot upload if already sent
    if (envelope.status !== 'DRAFT') {
      throw new ForbiddenException('Cannot upload document to envelope that has been sent');
    }

    // Create documentData
    const documentDataId = nanoid();

    await this.prisma.documentData.create({
      data: {
        id: documentDataId,
        type: 'BYTES_64',
        data: file.buffer.toString('base64'),
        initialData: file.buffer.toString('base64'),
      },
    });

    // Link documentData to envelope via envelopeItem
    const envelopeItem = await this.prisma.envelopeItem.create({
      data: {
        id: nanoid(),
        title: file.originalname || 'Document',
        envelopeId,
        documentDataId,
        order: 1,
      },
    });

    return {
      message: 'Document uploaded successfully',
      documentDataId,
      envelopeItemId: envelopeItem.id,
    };
  }

  /**
   * Send an envelope (change status to PENDING)
   */
  async send(envelopeId: string, userId: number, teamId: number) {
    const envelope = await this.prisma.envelope.findFirst({
      where: {
        id: envelopeId,
        userId,
        teamId,
        deletedAt: null,
      },
      include: {
        recipients: true,
        fields: true,
      },
    });

    if (!envelope) {
      throw new NotFoundException('Envelope not found');
    }

    if (envelope.status !== 'DRAFT') {
      throw new ForbiddenException('Envelope has already been sent');
    }

    if (envelope.recipients.length === 0) {
      throw new ForbiddenException('Envelope must have at least one recipient');
    }

    if (envelope.fields.length === 0) {
      throw new ForbiddenException('Envelope must have at least one field');
    }

    // Update status to PENDING
    const updated = await this.prisma.envelope.update({
      where: { id: envelopeId },
      data: {
        status: 'PENDING',
      },
      include: {
        recipients: true,
        documentMeta: true,
      },
    });

    // TODO: Send emails to recipients

    return updated;
  }
}
