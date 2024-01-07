import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const LOG = new Logger("MainLoader");
  const PORT = process.env.PORT || 5000
  
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
  LOG.log(`Server running on port ${PORT}`);
}
bootstrap();
