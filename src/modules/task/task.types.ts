import type { DataSource } from 'typeorm';
import type { infer as ZodInfer } from 'zod';
import { TaskPriority } from './enums/task-priority.enum.js';
import type { TaskStatus } from './enums/task-status.enum.js';
import type { CreateTaskSchema } from './schemas/create-task.schema.js';
import type { TaskQuerySchema } from './schemas/task-query.schema.js';
import type { UpdateTaskSchema } from './schemas/update-task.schema.js';

import type { CursorPaginationSchema } from '../../shared/schemas/cursor-pagination-schema.js';

// ! DTO-s
export type CreateTaskDto = ZodInfer<typeof CreateTaskSchema>;
export type UpdateTaskDto = ZodInfer<typeof UpdateTaskSchema>;
export type TaskFindAllQuery = ZodInfer<typeof TaskQuerySchema>;
export type TaskCursorQuery = ZodInfer<typeof CursorPaginationSchema>;

// ! Responses
export interface TaskResponse {
  authorId: number;
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline?: Date | undefined;
  isPrivate?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskPagePaginatedResponse {
  items: TaskResponse[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TaskCursorPaginatedResponse {
  items: TaskResponse[];
  nextCursor: string | null;
}

// ! Composer
export interface TaskModuleComposerArgs {
  dataSource: DataSource;
}
