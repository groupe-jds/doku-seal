import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Security
  app.use(helmet());
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Versioning - disabled for now to match frontend expectations
  // app.enableVersioning({
  //   type: VersioningType.URI,
  //   defaultVersion: '1',
  // });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Doku-Seal API')
    .setDescription('The Doku-Seal API documentation')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('documents', 'Document management')
    .addTag('envelopes', 'Envelope management')
    .addTag('organisations', 'Organisation management')
    .addTag('teams', 'Team management')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Backend should use port 3001, frontend uses 3000
  // Use API_PORT or BACKEND_PORT if set, otherwise default to 3001
  // Ignore global PORT variable if it's set to 3000 (frontend port)
  const port = parseInt(
    process.env.API_PORT ??
      process.env.BACKEND_PORT ??
      (process.env.PORT && process.env.PORT !== '3000' ? process.env.PORT : '3001'),
    10,
  );
  await app.listen(port);

  console.log(`🚀 Doku-Seal API is running on: http://localhost:${port}/api`);
  console.log(`📚 Swagger docs available at: http://localhost:${port}/api/docs`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
