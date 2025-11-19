import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateEnvelopeDto, UpdateEnvelopeDto, ListEnvelopesDto } from './dto';
import { nanoid } from 'nanoid';

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
    const envelope = await this.prisma.envelope.create({
      data: {
        id: envelopeId,
        secondaryId,
        externalId: dto.externalId,
        title: dto.title,
        status: 'DRAFT',
        source: 'DOCUMENT',
        type: 'DOCUMENT',
        visibility: dto.visibility,
        internalVersion: 1,
        userId,
        teamId,
        folderId: dto.folderId,
        documentMetaId,
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
            id: nanoid(),
            email: recipient.email,
            name: recipient.name,
            role: recipient.role,
            signingOrder: dto.signingOrder === 'SEQUENTIAL' ? index + 1 : null,
          })),
        },
      },
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

    const where: any = {
      userId,
      teamId,
      deletedAt: null,
    };

    if (status) {
      where.status = status;
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

    const envelope = await this.prisma.envelope.update({
      where: { id: envelopeId },
      data: {
        title: dto.title,
        visibility: dto.visibility,
        folderId: dto.folderId,
        documentMeta: {
          update: {
            subject: dto.subject,
            message: dto.message,
            redirectUrl: dto.redirectUrl,
          },
        },
      },
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
