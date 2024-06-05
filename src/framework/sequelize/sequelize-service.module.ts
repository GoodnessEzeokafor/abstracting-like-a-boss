import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SequelizeDatabaseServices } from './sequelize.service';
import models from './models';
import { ConfigService } from '@nestjs/config';
import { IDatabaseServices } from 'src/core';
const configService = new ConfigService();

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: configService.get('DB_HOST'),
      port: configService.get('DB_PORT'),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_NAME'),
      //   autoLoadModels: true,
      synchronize: false,
      models: [...models],
      define: {
        timestamps: true,
      },
      logging: false,
      pool: {
        max: 20,
        min: 0,
        idle: 10000, // max time in ms that a connection can be idle before being released
        acquire: 60000, // max time in ms that Pool will try to get connection before throwing error
        evict: 1000, // max time in ms after which sequelize will remove idle connections
      }, // todo: add to config
    }),
  ],
  providers: [
    {
      provide: IDatabaseServices,
      useClass: SequelizeDatabaseServices,
    },
  ],
  exports: [IDatabaseServices],
})
export class SequelizeServicesModule {}
