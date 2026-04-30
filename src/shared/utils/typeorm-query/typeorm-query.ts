import { Brackets, type ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import type { PaginationArgs, SearchArgs, SortingArgs } from './types.js';

/**
 * Applies pagination (skip/take) to a QueryBuilder.
 *
 * - If either `page` or `perPage` is missing, no pagination will be applied.
 */
export function applyPagination<EntityLike extends ObjectLiteral>({
  page,
  perPage,
  queryBuilder,
}: PaginationArgs<EntityLike>): SelectQueryBuilder<EntityLike> {
  if (!page || !perPage || page < 1 || perPage < 1) return queryBuilder;

  return queryBuilder.skip((page - 1) * perPage).take(perPage);
}

/**
 * Applies sorting (ORDER BY) to a QueryBuilder.
 *
 * - If `sortBy` or `order` is missing, no sorting will be applied.
 */
export function applySorting<EntityLike extends ObjectLiteral>({
  order,
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
  q,
  searchBy,
  queryBuilder,
}: SearchArgs<EntityLike>): SelectQueryBuilder<EntityLike> {
  const trimmedQ = q?.trim();

  if (!trimmedQ || !searchBy?.length) return queryBuilder;

  const alias = queryBuilder.alias;

  return queryBuilder.andWhere(
    new Brackets((qb1) => {
      searchBy.forEach((field) => {
        qb1.orWhere(`${alias}.${field.toString()} ILIKE :q`, { q: `%${trimmedQ}%` });
      });
    }),
  );
}
