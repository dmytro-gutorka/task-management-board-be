import { NotFoundException } from '@exceptions';

export class TaskNotFoundException extends NotFoundException {
  constructor() {
    super('Task not found.');
  }
}
