import type { DataSource, DeleteResult, Repository } from 'typeorm';
import type { Nullable } from '@types';
import type {
  CreateTaskDto,
  TaskCursorPaginatedResponse,
  TaskCursorQuery,
  TaskFindAllQuery,
  TaskPagePaginatedResponse,
  UpdateTaskDto,
} from '../task.types.js';
import {
  applyCursorPagination,
  applyFilters,
  applyPagePagination,
  applySearch,
  applySorting,
} from '@utils/typeorm-query';
import { TaskEntity } from '../entities/task.entity.js';

import { taskFilters } from '../configs/task-filters.config.js';

export class TaskRepository {
  private readonly taskRepository: Repository<TaskEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.taskRepository = this.dataSource.getRepository(TaskEntity);
  }

  async findAll(authorId: number, query: TaskFindAllQuery): Promise<TaskPagePaginatedResponse> {
    const queryBuilder = this.taskRepository.createQueryBuilder('tasks');
    const { search, searchBy, order, sortBy, page = 1, limit = 20 } = query;

    queryBuilder.andWhere('tasks.authorId = :authorId', { authorId });

    applyFilters({ queryBuilder, query, filters: taskFilters });
    applySearch({ search, searchBy, queryBuilder });
    applySorting({ order, sortBy, queryBuilder });

    const { items, total } = await applyPagePagination({ page, limit, queryBuilder });

    return {
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findFeed(authorId: number, query: TaskCursorQuery): Promise<TaskCursorPaginatedResponse> {
    const queryBuilder = this.taskRepository.createQueryBuilder('tasks');
    const { cursor, limit = 10 } = query;

    const { items, nextCursor } = await applyCursorPagination({
      authorId,
      cursor,
      limit,
      queryBuilder,
    });

    return { items, nextCursor };
  }

  async findOne(id: number, authorId?: number): Promise<Nullable<TaskEntity>> {
    return this.taskRepository.findOneBy({ id, authorId });
  }

  async create(createTaskDto: CreateTaskDto, authorId: number): Promise<TaskEntity> {
    const task = this.taskRepository.create({ ...createTaskDto, authorId });
    return this.taskRepository.save(task);
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
    authorId?: number,
  ): Promise<Nullable<TaskEntity>> {
    const task = await this.findOne(id, authorId);
    if (!task) return null;

    const mergedTask = this.taskRepository.merge(task, updateTaskDto);
    return this.taskRepository.save(mergedTask);
  }

  async delete(id: number, authorId?: number): Promise<DeleteResult> {
    return this.taskRepository.delete({ id, authorId });
  }
}
