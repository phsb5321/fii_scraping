import { AppModule } from '@/app/app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
    snapshot: true,
  });
  await app.listen(3000).then(() => {
    // Use a package emoji to indicate that the server is running
    console.log('📦 Server running on port 3000');
  });
}
bootstrap();
