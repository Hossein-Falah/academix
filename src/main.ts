import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerConfigInit } from './configs/swagger.config';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  SwaggerConfigInit(app);
  app.useStaticAssets('public');
  app.use(cookieParser(process.env.COOKIE_SECRET));
  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Server is running or http://localhost:${process.env.PORT}`);
    console.log(`Swagger is running http://localhost:${process.env.PORT}/swagger`);
  });
}
bootstrap();
