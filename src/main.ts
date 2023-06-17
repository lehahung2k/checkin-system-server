import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import { readFileSync } from 'fs';

async function bootstrap() {
  dotenv.config();

  // Đọc chứng chỉ và khóa riêng tư từ file PEM
  const httpsOptions: HttpsOptions = {
    key: readFileSync(`${process.env.SSL_KEY_FILE}`),
    cert: readFileSync(`${process.env.SSL_CRT_FILE}`),
  };

  const app = await NestFactory.create(AppModule, {httpsOptions});

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

  // app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 8080, () => {
    console.log(`Hello, this is server with port ${process.env.PORT || 8080}`);
  });
}
bootstrap();
