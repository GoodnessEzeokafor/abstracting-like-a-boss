/* eslint-disable @typescript-eslint/no-unused-vars */
import { Model } from 'sequelize';
import { IGenericRepository } from 'src/core';

export class SequelizeGenericRepository<T extends Model>
  implements IGenericRepository<T>
{
  private model: any;

  constructor(model: any) {
    this.model = model;
  }

  async findAllWithPagination(
    query: any,
    options?: {
      useDefault?: boolean;
      selectFields?: string[] | string;
      relationFields?: string[] | string;
    },
  ): Promise<{ data: T[]; pagination: any }> {
    const { perPage = 10, page = 1, order = [['createdAt', 'DESC']] } = query;
    const where: any = {};
    Object.keys(query).forEach((key) => {
      if (['limit', 'offset', 'order', 'perPage', 'page'].includes(key)) return;
      where[key] = query[key];
    });

    const offset = (page - 1) * perPage;

    const count = await this.model.count({ where });
    const data = await this.model.findAll({
      where,
      order,
      limit: perPage,
      offset,
      // ...(options?.selectFields ? { attributes: options.selectFields } : {}),
      // ...(options?.relationFields
      //   ? {
      //       include: options.relationFields.map((field) => ({
      //         required: false,
      //       })),
      //     }
      //   : {}),
    });

    return {
      data: data as T[],
      pagination: {
        hasPrevious: page > 1,
        prevPage: page - 1,
        hasNext: page < Math.ceil(count / perPage),
        next: page + 1,
        currentPage: Number(page),
        pageSize: perPage,
        lastPage: Math.ceil(count / perPage),
        total: count,
      },
    };
  }

  async findOne(key: Partial<T> | Partial<T>[]): Promise<T | null> {
    const where: any = {};
    Object.keys(key).forEach((k) => (where[k] = key[k]));
    return await this.model.findOne({
      where,
    });
  }

  async create(
    payload: Partial<T>,
    options?: { transaction?: any },
  ): Promise<T> {
    if (options?.transaction) {
      return await this.model.create(payload, {
        transaction: options?.transaction,
      });
    }
    return await this.model.create(payload);
  }

  async length(filter: Partial<T>): Promise<number> {
    return await this.model.count({ where: filter });
  }

  async update(
    key: Partial<T>,
    payload: Partial<T>,
    options?: { transaction: any },
  ) {
    const where: any = {};
    Object.keys(key).forEach((k) => (where[k] = key[k]));
    return await this.model.update(payload, {
      where,
      ...(options?.transaction ? { transaction: options.transaction } : {}),
    });
  }

  async delete(key: Partial<T>, options?: { transaction: any }) {
    const where: any = {};
    Object.keys(key).forEach((k) => (where[k] = key[k]));
    return await this.model.destroy({
      where,
      ...(options?.transaction ? { transaction: options.transaction } : {}),
    });
  }

  async bulkCreate(payload: Partial<T[]>, _options?: { transaction: any }) {
    return await this.model.bulkCreate(payload);
  }
}
