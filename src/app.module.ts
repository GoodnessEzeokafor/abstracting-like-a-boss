import { Module } from '@nestjs/common';
import { DatabaseServicesModule } from './services/database-services/database-services.module';

@Module({
  imports: [DatabaseServicesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
