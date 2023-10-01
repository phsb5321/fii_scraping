import { AppModule } from '@/app/app.module';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });

  // Enable CORS
  app.enableCors();

  // Set Global Prefix
  app.setGlobalPrefix('api');

  // Set up Swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('The description of the API')
    .setVersion('1.0')
    .addTag('nestjs')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);

  // General Api
  console.log('📦 Server running on http://localhost:3000/api');

  // Swagger
  console.log('📚 Swagger running on http://localhost:3000/api-docs');
}

bootstrap();
