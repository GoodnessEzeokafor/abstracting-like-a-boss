import 'reflect-metadata';
import { ConfigService } from '@nestjs/config';

import models from './models';

const configService = new ConfigService();

export enum DATABASE_TYPES {
  MYSQL = 'mysql',
  PG = 'postgres',
}

export const DATABASE_CONFIG = {
  type: DATABASE_TYPES.PG,
  url: configService.get('DB_URL'),
  entities: [...models],
  migrations: [__dirname + '/migrations/staging/*.ts'],

  migrationsTableName: 'custom_migration',
  synchronize: false, // default setting
  retryAttempts: 10,
  retryDelay: 3000,
  logging: false,
  autoLoadEntities: false,
  cli: {
    migrationsDir: '../staging',
  },
  ssl: configService.get('DB_USE_SSL')
    ? {
        rejectUnauthorized: false,
      }
    : false,
};
