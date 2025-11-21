import type { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { getDatabaseUrl } from '@doku-seal/prisma/helper';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    // Ensure database URL is normalized before Prisma initialization
    getDatabaseUrl();

    super({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
      ],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Database connected successfully');
    } catch (error) {
      this.logger.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }

  // Helper method for soft deletes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/promise-function-async
  softDelete(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    model: {
      update: (args: { where: { id: string }; data: { deletedAt: Date } }) => Promise<unknown>;
    },
    id: string,
  ) {
    return model.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // Helper method to clean up database (for testing)
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production');
    }

    const models = Object.keys(this).filter((key) => !key.startsWith('_') && !key.startsWith('$'));

    return Promise.all(
      models.map(async (modelKey) => {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const model = this[modelKey as keyof PrismaService];
        if (model && typeof model === 'object' && 'deleteMany' in model) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions
          return (model as { deleteMany: () => Promise<unknown> }).deleteMany();
        }
        return Promise.resolve(undefined);
      }),
    );
  }
}
