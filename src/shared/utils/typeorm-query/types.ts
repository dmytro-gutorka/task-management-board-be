import type { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import type { SortOrder } from '@types';

export interface BaseArgs<EntityLike extends ObjectLiteral> {
  queryBuilder: SelectQueryBuilder<EntityLike>;
}

export type EntityWithId = ObjectLiteral & {
  id: number;
};

export interface PaginationArgs<EntityLike extends EntityWithId> {
  authorId: number;
  cursor?: string;
  limit: number;
  queryBuilder: SelectQueryBuilder<EntityLike>;
}

export interface CursorPaginatedResponse<EntityLike> {
  items: EntityLike[];
  nextCursor: string | null;
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
