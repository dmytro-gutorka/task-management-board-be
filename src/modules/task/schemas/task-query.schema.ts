import { PagePaginationSchema } from '../../../shared/schemas/page-pagination.schema.js';
import { PriorityTaskQuerySchema } from './priority-task-query.schema.js';
import { StatusTaskQuerySchema } from './status-task-query.schema.js';
import { createSearchQuerySchema } from '@schemas/search-query.schema.js';
import { createSortingQuerySchema } from '@schemas/sorting-query.schema.js';

const SearchQuerySchema = createSearchQuerySchema(['title', 'description']);
const SortingQuerySchema = createSortingQuerySchema(['createdAt', 'title', 'deadline']);

export const TaskQuerySchema = SearchQuerySchema.extend(SortingQuerySchema.shape)
  .extend(PagePaginationSchema.shape)
  .extend(StatusTaskQuerySchema.shape)
  .extend(PriorityTaskQuerySchema.shape);
