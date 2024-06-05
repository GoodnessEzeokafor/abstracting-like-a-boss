import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { SequelizeGenericRepository } from './sequelize-generic-repository.service';
import { Category } from './models/category';
import { IDatabaseServices } from 'src/core';

@Injectable()
export class SequelizeDatabaseServices
  implements IDatabaseServices, OnApplicationBootstrap
{
  categories: SequelizeGenericRepository<Category>;

  onApplicationBootstrap() {
    this.categories = new SequelizeGenericRepository<Category>(Category);
  }
}
