import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypeOrmGenericRepository } from './typeorm-generic-repository.service';
import { Feedback } from './models/feedback';
import { IDatabaseServices } from 'src/core';

@Injectable()
export class TypeOrmDatabaseServices
  implements IDatabaseServices, OnApplicationBootstrap
{
  feedbacks: TypeOrmGenericRepository<Feedback>;

  constructor(private connection: DataSource) {}

  onApplicationBootstrap() {
    this.feedbacks = new TypeOrmGenericRepository<Feedback>(
      this.connection,
      Feedback,
    );
  }
}
