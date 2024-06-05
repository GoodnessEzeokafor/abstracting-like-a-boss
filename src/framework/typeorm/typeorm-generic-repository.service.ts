import { IGenericRepository } from 'src/core';
import { DataSource, EntityManager, EntityTarget, UpdateResult } from 'typeorm';

export class TypeOrmGenericRepository<T> implements IGenericRepository<T> {
  private _selectFields: string[];
  private _relationFields: string[];

  private _entity: any;
  private _txEntity: any;

  constructor(
    private connection: DataSource,
    entity: EntityTarget<T>,
    options?: {
      select?: string[];
      relation?: string[];
      fullText?: string[];
    },
  ) {
    this._entity = this.connection.getRepository(entity);
    this._txEntity = entity;
    this._selectFields = options?.select || [];
    this._relationFields = options?.relation || [];
  }

  async findAllWithPagination(
    query: any,
    options?: {
      useDefault?: boolean;
      selectFields?: string[] | string;
      relationFields?: string[] | string;
    },
  ): Promise<{
    data: any;
    pagination: {
      hasPrevious: boolean;
      prevPage: number;
      hasNext: boolean;
      next: number;
      currentPage: number;
      pageSize: number;
      lastPage: number;
      total: any;
    };
  }> {
    try {
      const perpage = Number(query.perpage) || 10;
      const page = Number(query.page) || 1;
      const sort = query.sort || 'DESC';

      const excludedFields = [
        'page',
        'perpage',
        'dateFrom',
        'dateTo',
        'sort',
        'search',
        'sortBy',
        'orderBy',
      ];
      excludedFields.forEach((el) => delete query[el]);

      let data: any = {};

      if (options?.useDefault) {
        data = await this._entity.find({
          relations: this._relationFields,
          select: this._selectFields,
          where: { ...query },
          order: {
            createdAt: sort,
          },
          take: perpage,
          skip: page * perpage - perpage,
          loadRelationIds: true,
        });
      } else if (options?.selectFields) {
        data = await this._entity.find({
          select: options?.selectFields,
          where: { ...query },
          order: {
            createdAt: sort,
          },
          take: perpage,
          skip: page * perpage - perpage,
          loadRelationIds: true,
        });
      } else if (options?.relationFields) {
        data = await this._entity.find({
          relations: options?.relationFields,
          where: { ...query },
          order: {
            createdAt: sort,
          },
          take: perpage,
          skip: page * perpage - perpage,
          loadRelationIds: true,
        });
      } else if (options?.selectFields && options?.relationFields) {
        data = await this._entity.find({
          relations: options?.relationFields,
          select: options?.selectFields,
          where: { ...query },
          order: {
            createdAt: sort,
          },
          take: perpage,
          skip: page * perpage - perpage,
          loadRelationIds: true,
        });
      } else {
        data = await this._entity.find({
          where: { ...query },
          order: {
            createdAt: sort,
          },
          take: perpage,
          skip: page * perpage - perpage,
          loadRelationIds: true,
        });
      }
      const total = await this._entity.count({ where: { ...query } });
      const pagination = {
        hasPrevious: page > 1,
        prevPage: page - 1,
        hasNext: page < Math.ceil(total / perpage),
        next: page + 1,
        currentPage: Number(page),
        pageSize: perpage,
        lastPage: Math.ceil(total / perpage),
        total,
      };

      return { data, pagination };
    } catch (e) {
      throw new Error(e);
    }
  }
  async findOne(
    key: Partial<T> | Partial<T>[],
    options?: {
      useDefault?: boolean;
      selectFields?: string[] | string;
      relationFields?: string[] | string;
      relationIds?: boolean;
    },
  ): Promise<T> {
    try {
      if (options?.useDefault) {
        const data = await this._entity.findOne({
          where: key,
          relations: this._relationFields,
          select: this._selectFields,
        });
        return Promise.resolve(data);
      }
      if (options?.selectFields && options?.relationFields) {
        const data = await this._entity.findOne({
          where: key,
          relations: options?.relationFields,
          select: options?.selectFields,
        });
        return Promise.resolve(data);
      }
      if (options?.selectFields) {
        const data = await this._entity.findOne({
          where: key,
          select: options?.selectFields,
        });
        return Promise.resolve(data);
      }
      if (options?.relationFields) {
        const data = await this._entity.findOne({
          relations: options?.relationFields,
          where: key,
        });
        return Promise.resolve(data);
      }
      if (options?.relationIds) {
        const data = await this._entity.findOne({
          relations: options?.relationFields,
          where: key,
          loadRelationIds: true,
        });
        return Promise.resolve(data);
      }

      const data = await this._entity.findOne({ where: key });
      return Promise.resolve(data);
    } catch (e) {
      throw new Error(e);
    }
  }
  async create(
    payload: T,
    options?: { useQueryBuilder?: boolean; transaction?: EntityManager },
  ): Promise<T> {
    try {
      if (options?.transaction)
        return await options.transaction
          .getRepository(this._txEntity)
          .save(payload);
      if (!options?.useQueryBuilder) return await this._entity.save(payload);

      const { raw } = await this._entity
        .createQueryBuilder()
        .insert()
        .values(payload)
        .execute();
      if (raw.affectedRows !== 1) throw new Error('Query failed');

      return payload;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   *
   * @param query
   * @returns custom query runner
   */
  async runQuery(query: string) {
    try {
      const data = await this._entity.query(query);

      return data;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async length(filter: Partial<T>) {
    try {
      const data = await this._entity.count({ where: { ...filter } });
      return Promise.resolve(data);
    } catch (e: any) {
      return Promise.reject(e);
    }
  }

  async update(
    key: Partial<T>,
    payload: Partial<T>,
    options?: { transaction?: EntityManager },
  ): Promise<UpdateResult> {
    try {
      if (options?.transaction) {
        const data = await options.transaction
          .getRepository(this._txEntity)
          .update({ ...key }, { ...payload });
        return data.raw[0];
      }

      const data = await this._entity.update({ ...key }, { ...payload });
      return data;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async delete(key: Partial<T>, options?: { transaction: EntityManager }) {
    try {
      if (options?.transaction) {
        const data = await options.transaction
          .getRepository(this._txEntity)
          .delete({ ...key });
        return data;
      }
      const data = await this._entity.delete({ ...key });
      return data;
    } catch (e) {
      throw new Error(e);
    }
  }
}

// take: perpage,
//   skip:
