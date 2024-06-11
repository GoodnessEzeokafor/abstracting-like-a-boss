import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { FeedbackFactoryServices } from './feedback-factory.service';
import { DataSource } from 'typeorm';
import { IDatabaseServices } from 'src/core';

@Injectable()
export class FeedbackServices implements OnApplicationShutdown {
  constructor(
    private readonly data: IDatabaseServices,
    private readonly factory: FeedbackFactoryServices,
    private readonly connection: DataSource,
  ) {}
  async onApplicationShutdown(signal: string) {
    console.log('signal', signal);
    this.connection.destroy();
  }

  async sendFeedback(payload: any) {
    const factory = this.factory.create(payload);
    return await this.data.feedbacks.create(factory);
  }

  async getFeedbacks() {
    return await this.data.feedbacks.findAllWithPagination({});
  }

  async getSingleFeedback() {
    return await this.data.feedbacks.findOne({ email: 'goodyx@ggmail.com' });
  }

  async deleteFeedback() {
    return await this.data.feedbacks.delete({ email: 'goodyx@ggmail.com' });
  }

  async updateFeedback() {
    return await this.data.feedbacks.update(
      { email: 'goodyx@ggmail.com' },
      { email: 'goody@gmail.com' },
    );
  }
}
