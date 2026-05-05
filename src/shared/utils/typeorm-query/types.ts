import type { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import type { SortOrder } from '@types';

export interface BaseArgs<EntityLike extends ObjectLiteral> {
  queryBuilder: SelectQueryBuilder<EntityLike>;
}

export interface PaginationArgs<EntityLike extends ObjectLiteral> extends BaseArgs<EntityLike> {
  page?: number;
  perPage?: number;
}

export interface SortingArgs<EntityLike extends ObjectLiteral> extends BaseArgs<EntityLike> {
  sortBy?: keyof EntityLike;
  order?: SortOrder;
}

export interface SearchArgs<EntityLike extends ObjectLiteral> extends BaseArgs<EntityLike> {
  q?: string;
  searchBy?: (keyof EntityLike)[];
}

export interface FilterConfig<TQuery> {
  queryKey: keyof TQuery;
  field: string;
  ignoreValue?: unknown;
}

export interface FilterArgs<EntryLike extends ObjectLiteral, TQuery> {
  queryBuilder: SelectQueryBuilder<EntryLike>;
  query: TQuery;
  filters: FilterConfig<TQuery>[];
}
