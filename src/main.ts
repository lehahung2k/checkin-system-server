import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

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

  await app.listen(process.env.PORT || 8080);
}
bootstrap();
