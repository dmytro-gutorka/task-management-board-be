import type { Response } from 'express';
import type { TypedRequest } from '@types';
import type { UpdateUserDto } from './types.js';
import type { UserService } from './services/user.service.js';

export class UserController {
  constructor(private readonly userService: UserService) {}

  me = async (req: TypedRequest<{ params: { id: number } }>, res: Response) => {
    const user = req.user!;
    const currentUser = await this.userService.findOne(user.id);
    res.status(200).json(currentUser);
  };

  updateMe = async (req: TypedRequest<{ body: UpdateUserDto }>, res: Response) => {
    const user = req.user!;
    const updateUserDto = req.validated.body;
    const updatedUser = await this.userService.update(user.id, updateUserDto);
    res.status(200).json(updatedUser);
  };

  deleteMe = async (req: TypedRequest, res: Response) => {
    const user = req.user!;
    const messageResponse = await this.userService.delete(user.id);
    res.status(200).json(messageResponse);
  };
}
