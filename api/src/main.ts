import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { config as ConfigurationENV } from 'dotenv';

const Logguer = new Logger("MainLoader");

ConfigurationENV();

async function bootstrap() {
  const PORT = process.env.PORT || 5000

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONT_END_URL,
  });

  await app.listen(PORT, () => 
    Logguer.log(`Server running on port ${PORT}`)
  );
  
}

bootstrap();
