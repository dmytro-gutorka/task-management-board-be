import { z } from 'zod';
import { TaskPriority } from '../enums/task-priority.enum.js';
import { TaskStatus } from '../enums/task-status.enum.js';

const TaskStatusValues = Object.values(TaskStatus);
const PriorityStatusValues = Object.values(TaskPriority);

export const CreateTaskSchema = z.strictObject({
  title: z.string('Title is required field').min(3, 'Min title length is 3'),
  description: z.string('Description is required field').min(5, 'Min description length is 5'),
  status: z
    .enum(TaskStatus, `Task status must be one of: ${TaskStatusValues.join(', ')}`)
    .optional()
    .default(TaskStatus.TODO),
  priority: z
    .enum(TaskPriority, `Task status must be one of: ${PriorityStatusValues.join(', ')}`)
    .optional()
    .default(TaskPriority.MEDIUM),
  deadline: z.coerce.date().optional(),
  isPrivate: z.boolean().optional().default(false),
});
