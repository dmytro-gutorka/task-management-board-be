import type { Response } from 'express';
import type { TypedRequest } from '@types';
import type { CreateTaskDto, TaskFindAllQuery, UpdateTaskDto } from './task.types.js';
import type { TaskService } from './services/task.service.js';

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  findAll = async (req: TypedRequest<{ query: TaskFindAllQuery }>, res: Response) => {
    const user = req.user!;
    const query = req.validated.query;
    const tasks = await this.taskService.findAll(user, query);

    res.status(200).json(tasks);
  };

  findOne = async (req: TypedRequest<{ params: { id: number } }>, res: Response) => {
    const user = req.user!;
    const taskId = req.validated.params.id;
    const task = await this.taskService.findOne(taskId, user);

    res.status(200).json(task);
  };

  create = async (req: TypedRequest<{ body: CreateTaskDto }>, res: Response) => {
    const user = req.user!;
    const task = await this.taskService.create(req.validated.body, user);
    res.status(201).json(task);
  };

  update = async (
    req: TypedRequest<{ body: UpdateTaskDto; params: { id: number } }>,
    res: Response,
  ) => {
    const user = req.user!;
    const taskId = req.validated.params.id;
    const updateTaskDto = req.validated.body;

    const task = await this.taskService.update(taskId, updateTaskDto, user);

    res.status(200).json(task);
  };

  delete = async (req: TypedRequest<{ params: { id: number } }>, res: Response) => {
    const user = req.user!;
    const taskId = req.validated.params.id;

    const deleteResponse = await this.taskService.delete(taskId, user);

    res.status(200).json(deleteResponse);
  };
}
