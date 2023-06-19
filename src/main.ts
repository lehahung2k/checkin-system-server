import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  const configSwagger = new DocumentBuilder()
    .setTitle('Checkin API')
    .setDescription('Checkin system API endpoints')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  // Configure CORS:
  const corsConfig: CorsOptions = {
    origin: process.env.CLIENT_URL,
    methods: 'GET, POST, PUT, PATCH, DELETE',
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authorization', // Include Authorization header
    credentials: true,
  };
  app.enableCors(corsConfig);

  // Tăng giới hạn kích thước payload
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ limit: '5mb', extended: true }));
  // app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 8080, () => {
    console.log(`Hello, this is server with port ${process.env.PORT || 8080}`);
  });
}
bootstrap();
