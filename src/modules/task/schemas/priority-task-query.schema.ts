import { z } from 'zod';
import { TaskPriorityFilter } from '../enums/task-priority.enum.js';

const priorityValues = Object.values(TaskPriorityFilter);

export const PriorityTaskQuerySchema = z.object({
  priority: z
    .enum(priorityValues, `Available priority fields are: ${priorityValues.join(', ')}`)
    .default(TaskPriorityFilter.ALL),
});
