import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseServicesModule } from './services/database-services/database-services.module';

@Module({
  imports: [DatabaseServicesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
