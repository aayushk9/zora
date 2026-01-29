import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
 
  const server = app.getHttpAdapter().getInstance();
  server.set('trust proxy', 1);  

  app.enableCors({
    origin: [
    "http://localhost:5173",
    "https://zora-phase1.vercel.app"
  ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  app.enableVersioning({
    type: VersioningType.URI, 
  });

  app.setGlobalPrefix('api');
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();