import { Injectable } from '@nestjs/common';
import { PaginationDto } from '@src/module/shared/dto/pagination.dto';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}

type PrismaModelDelegate<T, WhereInput, FindManyArgs> = {
  findMany(args?: FindManyArgs): Promise<T[]>;
  count(args?: { where?: WhereInput }): Promise<number>;
};

@Injectable()
export class PaginationService {
  async paginate<T, WhereInput, FindManyArgs extends { where?: WhereInput }>(
    model: PrismaModelDelegate<T, WhereInput, FindManyArgs>,
    paginationDto: PaginationDto,
    options?: Omit<FindManyArgs, 'skip' | 'take' | 'orderBy'>,
  ): Promise<PaginatedResult<T>> {
    const { page, limit, sortBy, sortOrder } = paginationDto;
    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      model.count({ where: options?.where }),
      model.findMany({
        ...(options as FindManyArgs),
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
    ]);

    const lastPage = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        lastPage,
        currentPage: page,
        perPage: limit,
        prev: page > 1 ? page - 1 : null,
        next: page < lastPage ? page + 1 : null,
      },
    };
  }
}
