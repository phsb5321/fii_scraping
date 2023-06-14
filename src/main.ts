import { AppModule } from '@/app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });
  // Create a Swagger document
  const config = new DocumentBuilder()
    .setTitle('Scrap Money')
    .setDescription('API description')
    .setVersion('1.0')
    .build();

  // Generate Swagger JSON from the document
  const document = SwaggerModule.createDocument(app, config);

  // Set up Swagger UI
  SwaggerModule.setup('api', app, document);

  await app.listen(3000).then(() => {
    // Use a package emoji to indicate that the server is running
    console.log('📦 Server running on port 3000');
  });
}
bootstrap();
