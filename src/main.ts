import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(helmet());
  app.enableCors();
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
