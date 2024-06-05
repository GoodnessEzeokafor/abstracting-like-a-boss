import { Module } from '@nestjs/common';
import { DatabaseServicesModule } from 'src/services/database-services/database-services.module';
import { FeedbackFactoryServices } from './feedback-factory.service';
import { FeedbackServices } from './feedback.service';

@Module({
  imports: [DatabaseServicesModule],
  providers: [FeedbackServices, FeedbackFactoryServices],
  exports: [FeedbackServices],
})
export class FeedbackServicesModule {}
