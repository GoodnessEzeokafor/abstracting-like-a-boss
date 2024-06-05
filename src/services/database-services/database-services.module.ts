import { Module } from '@nestjs/common';
import { TypeOrmServicesModule } from 'src/framework/typeorm/typeorm-service.module';

@Module({
  imports: [TypeOrmServicesModule],
  exports: [TypeOrmServicesModule],
})
export class DatabaseServicesModule {}
