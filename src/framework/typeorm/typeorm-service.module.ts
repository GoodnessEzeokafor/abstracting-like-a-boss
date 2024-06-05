import { Module } from '@nestjs/common';

import { DATABASE_CONFIG } from './config';
import { TypeOrmDatabaseServices } from './typeorm.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IDatabaseServices } from 'src/core';

@Module({
  imports: [TypeOrmModule.forRoot(DATABASE_CONFIG)],
  providers: [
    {
      provide: IDatabaseServices,
      useClass: TypeOrmDatabaseServices,
    },
  ],
  exports: [IDatabaseServices],
})
export class TypeOrmServicesModule {}
