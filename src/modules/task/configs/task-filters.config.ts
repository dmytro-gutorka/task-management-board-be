import type { FilterConfig } from '../../../shared/utils/typeorm-query/types.js';
import type { TaskFindAllQuery } from '../task.types.js';
import { TaskFilterFieldsEnum } from '../enums/task-filter-fields.enum.js';
import { TaskPriorityFilter } from '../enums/task-priority.enum.js';
import { TaskFilterStatus } from '../enums/task-status.enum.js';

export const taskFilters = [
  {
    queryKey: 'priority',
    field: TaskFilterFieldsEnum.PRIORITY,
    ignoreValue: TaskPriorityFilter.ALL,
  },
  {
    queryKey: 'status',
    field: TaskFilterFieldsEnum.STATUS,
    ignoreValue: TaskFilterStatus.ALL,
  },
] satisfies FilterConfig<TaskFindAllQuery>[];
