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
}
