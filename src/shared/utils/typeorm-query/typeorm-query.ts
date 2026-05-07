import { Brackets, type ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import type {
  CursorPaginatedResponse,
  CursorPaginationArgs,
  EntityWithId,
  FilterArgs,
  PagePaginatedResponse,
  PagePaginationArgs,
  SearchArgs,
  SortingArgs,
} from './types.js';

import { SortOrder } from '../../types/index.js';

export async function applyPagePagination<EntityLike extends ObjectLiteral>({
  page,
  limit,
  queryBuilder,
}: PagePaginationArgs<EntityLike>): Promise<PagePaginatedResponse<EntityLike>> {
  const [items, total] = await queryBuilder
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return { items, total };
}

export async function applyCursorPagination<EntityLike extends EntityWithId>({
  authorId,
  cursor,
  limit,
  queryBuilder,
}: CursorPaginationArgs<EntityLike>): Promise<CursorPaginatedResponse<EntityLike>> {
  const alias = queryBuilder.alias;

  queryBuilder.andWhere(`${alias}.authorId = :authorId`, { authorId });

  if (cursor) {
    queryBuilder.andWhere(`${alias}.id < :cursor`, {
      cursor: Number(cursor),
    });
  }

  queryBuilder.addOrderBy(`${alias}.id`, SortOrder.DESC);

  const itemsWithExtra = await queryBuilder.take(limit + 1).getMany();

  const hasNextPage = itemsWithExtra.length > limit;
  const items = hasNextPage ? itemsWithExtra.slice(0, limit) : itemsWithExtra;
  const lastItem = items.at(-1);

  return {
    items,
    nextCursor: hasNextPage && lastItem ? String(lastItem.id) : null,
  };
}

/**
 * Applies sorting (ORDER BY) to a QueryBuilder.
 *
 * - If `sortBy` or `order` is missing, no sorting will be applied.
 */
export function applySorting<EntityLike extends ObjectLiteral>({
  order = SortOrder.ASC,
  sortBy,
  queryBuilder,
}: SortingArgs<EntityLike>): SelectQueryBuilder<EntityLike> {
  if (!sortBy || !order) return queryBuilder;
  const alias = queryBuilder.alias;

  return queryBuilder.addOrderBy(`${alias}.${sortBy.toString()}`, order);
}

/**
 * Applies full-text search across multiple fields (OR conditions).
 *
 * - Uses Postgres `ILIKE` for case-insensitive search.
 * - If `q` is empty or no `fields` are provided, no search will be applied.
 * - Multiple fields are combined with OR inside a single bracket group.
 */
export function applySearch<EntityLike extends ObjectLiteral>({
  search,
  searchBy,
  queryBuilder,
}: SearchArgs<EntityLike>): SelectQueryBuilder<EntityLike> {
  const trimmedQ = search?.trim();

  if (!trimmedQ || !searchBy?.length) return queryBuilder;

  const alias = queryBuilder.alias;

  return queryBuilder.andWhere(
    new Brackets((qb1) => {
      searchBy.forEach((field) => {
        qb1.orWhere(`${alias}.${field.toString()} ILIKE :search`, { search: `%${trimmedQ}%` });
      });
    }),
  );
}

export function applyFilters<EntryLike extends ObjectLiteral, TQuery>({
  queryBuilder,
  query,
  filters,
}: FilterArgs<EntryLike, TQuery>): SelectQueryBuilder<EntryLike> {
  const alias = queryBuilder.alias;

  filters.forEach(({ queryKey, field, ignoreValue }) => {
    const value = query[queryKey];
    const paramKey = String(queryKey);

    if (value === undefined || value === ignoreValue) return;

    if (value === null) {
      queryBuilder.andWhere(`${alias}.${field} IS NULL`);
      return;
    }

    queryBuilder.andWhere(`${alias}.${field} = :${String(queryKey)}`, {
      [paramKey]: value,
    });
  });

  return queryBuilder;
}
