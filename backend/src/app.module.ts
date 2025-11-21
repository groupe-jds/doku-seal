import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { EnvelopesModule } from './modules/envelopes/envelopes.module';
import { RecipientsModule } from './modules/recipients/recipients.module';
import { FieldsModule } from './modules/fields/fields.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as path from 'path';

@Module({
  imports: [
    // Configuration - look for .env files in root directory
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        path.join(process.cwd(), '..', '.env.local'),
        path.join(process.cwd(), '..', '.env'),
        path.join(process.cwd(), '.env.local'),
        path.join(process.cwd(), '.env'),
      ],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests
      },
    ]),

    // Database
    DatabaseModule,

    // Feature modules
    AuthModule,
    EnvelopesModule,
    RecipientsModule,
    FieldsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Apply JWT auth guard globally
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
