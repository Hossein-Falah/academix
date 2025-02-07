import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { SwaggerConfigInit } from './configs/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerConfigInit(app);
  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Server is running or http://localhost:${process.env.PORT}`);
    console.log(`Swagger is running http://localhost:${process.env.PORT}/swagger`);
  });
}
bootstrap();
