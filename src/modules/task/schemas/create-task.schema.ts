import { z } from 'zod';
import { TaskStatus } from '../enums/task-status.enum.js';

const TaskStatusValues = Object.values(TaskStatus);

export const CreateTaskSchema = z.strictObject({
  title: z.string('Title is required field').min(3, 'Min title length is 3'),
  description: z.string('Description is required field').min(5, 'Min description length is 5'),
  status: z
    .enum(TaskStatus, `Task status must be one of: ${TaskStatusValues.join(', ')}`)
    .optional()
    .default(TaskStatus.PENDING),
});
