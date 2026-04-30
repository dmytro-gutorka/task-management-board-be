import type { DataSource } from 'typeorm';
import type { infer as ZodInfer } from 'zod';
import type { TaskStatus } from './enums/task-status.enum.js';
import type { CreateTaskSchema } from './schemas/create-task.schema.js';
import type { TaskQuerySchema } from './schemas/task-query.schema.js';
import type { UpdateTaskSchema } from './schemas/update-task.schema.js';

// ! DTO-s
export type CreateTaskDto = ZodInfer<typeof CreateTaskSchema>;

export type UpdateTaskDto = ZodInfer<typeof UpdateTaskSchema>;

export type TaskFindAllQuery = ZodInfer<typeof TaskQuerySchema>;

// ! Responses
export interface TaskResponse {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
}

// ! Composer
export interface TaskModuleComposerArgs {
  dataSource: DataSource;
}
