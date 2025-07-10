import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { VersioningType } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(helmet());
  app.enableCors();
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1', '2'],
  });
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3001);
  console.log(
    'Application started successfully on port',
    process.env.PORT ?? 3001,
  );
}
bootstrap().catch((err) => {
  console.error('Failed to start application', err);
  process.exit(1);
});
