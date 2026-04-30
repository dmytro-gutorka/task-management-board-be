import type { ActiveUser } from '@modules/auth';
import type { MessageResponse } from '@types';
import type {
  CreateTaskDto,
  TaskFindAllQuery,
  TaskResponse,
  UpdateTaskDto,
} from '../task.types.js';
import type { TaskRepository } from '../repositories/task.repository.js';
import { TaskNotFoundException } from '../exceptions/task-not-found.exception.js';

export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async findAll(user: ActiveUser, query: TaskFindAllQuery): Promise<TaskResponse[]> {
    return this.taskRepository.findAll(user.id, query);
  }

  async findOne(id: number, user: ActiveUser): Promise<TaskResponse> {
    const task = await this.taskRepository.findOne(id, user.id);
    if (!task) throw new TaskNotFoundException();

    return task;
  }

  async create(createTaskDto: CreateTaskDto, user: ActiveUser): Promise<TaskResponse> {
    return this.taskRepository.create(createTaskDto, user.id);
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, user: ActiveUser): Promise<TaskResponse> {
    const updatedTask = await this.taskRepository.update(id, updateTaskDto, user.id);
    if (!updatedTask) throw new TaskNotFoundException();

    return updatedTask;
  }

  async delete(id: number, user: ActiveUser): Promise<MessageResponse> {
    const deleteResult = await this.taskRepository.delete(id, user.id);
    if (!deleteResult.affected) throw new TaskNotFoundException();

    return { message: 'Task deleted successfully' };
  }
}
