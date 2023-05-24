import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as dotenv from 'dotenv';
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  const configSwagger = new DocumentBuilder()
    .setTitle('Checkin API')
    .setDescription('Checkin system API endpoints')
    .setVersion('1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  // Configure CORS:
  const corsConfig: CorsOptions = {
    origin: process.env.CLIENT_URL,
    methods: 'GET, POST, PUT, PATCH, DELETE',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
  };
  app.enableCors(corsConfig);

  // app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 8080);
}
bootstrap();
