import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from 'src/configs/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(TypeOrmConfig())],
  controllers: [],
  providers: [],
})
export class AppModule {}
