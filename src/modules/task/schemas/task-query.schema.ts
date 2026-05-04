import { priorityTaskQuerySchema } from './priority-task-query.schema.js';
import { statusTaskQuerySchema } from './status-task-query.schema.js';
import { PaginationSchema } from '@schemas/pagination.schema.js';
import { createSearchQuerySchema } from '@schemas/search-query.schema.js';
import { createSortingQuerySchema } from '@schemas/sorting-query.schema.js';

const SearchQuerySchema = createSearchQuerySchema(['title', 'description']);
const SortingQuerySchema = createSortingQuerySchema(['createdAt', 'title', 'deadline']);

export const TaskQuerySchema = SearchQuerySchema.extend(SortingQuerySchema.shape)
  .extend(PaginationSchema.shape)
  .extend(statusTaskQuerySchema.shape)
  .extend(priorityTaskQuerySchema.shape);
