import { Module } from '@nestjs/common';
import { DatabaseServicesModule } from './services/database-services/database-services.module';
import { FeedbackServicesModule } from './services/user-case/feedback/feedback.module';

@Module({
  imports: [DatabaseServicesModule, FeedbackServicesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
