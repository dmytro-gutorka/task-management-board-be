import type { DataSource, DeleteResult, Repository } from 'typeorm';
import type { Nullable } from '@types';
import type { CreateTaskDto, TaskFindAllQuery, UpdateTaskDto } from '../task.types.js';
import { applyPagination, applySearch, applySorting } from '@utils/typeorm-query';
import { TaskEntity } from '../entities/task.entity.js';

export class TaskRepository {
  private readonly taskRepository: Repository<TaskEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.taskRepository = this.dataSource.getRepository(TaskEntity);
  }

  async findAll(authorId: number, query: TaskFindAllQuery): Promise<TaskEntity[]> {
    const queryBuilder = this.taskRepository.createQueryBuilder('tasks');
    const { q, searchBy, order, sortBy, page, perPage } = query;

    applySearch({ q, searchBy, queryBuilder });
    applySorting({ order, sortBy, queryBuilder });
    applyPagination({ page, perPage, queryBuilder });

    return queryBuilder.andWhere({ authorId }).getMany();
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
