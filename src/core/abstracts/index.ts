import { CategoryEntity, FeedbackEntity } from '../entities';

export abstract class IGenericRepository<T> {
  abstract findAllWithPagination(
    query?: any,
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
  }>;

  abstract findOne(
    key: Partial<T> | Partial<T>[],
    options?: {
      useDefault?: boolean;
      selectFields?: string[] | string;
      relationFields?: string[] | string;
      relationIds?: boolean;
    },
  ): Promise<T>;

  abstract create(
    payload: Partial<T>,
    options?: { transaction?: any },
  ): Promise<T>;

  abstract length(filter: Partial<T>): Promise<any>;

  abstract delete(key: Partial<T>, options?: { transaction: any });
  abstract update(
    key: Partial<T>,
    payload: Partial<T>,
    options?: { transaction?: any },
  ): Promise<any>;
}

export abstract class IDatabaseServices {
  abstract feedbacks?: IGenericRepository<FeedbackEntity>;
  abstract categories?: IGenericRepository<CategoryEntity>;
}
