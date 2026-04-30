import type { EntityManager } from 'typeorm';
import type { MessageResponse, Nullable } from '@types';
import type { CreateUserDto, UpdateUserDto, UserResponse } from '../types.js';
import type { UserRepository } from '../repositories/user.repository.js';
import { ConflictException, NotFoundException } from '@exceptions';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOne(id: number): Promise<UserResponse> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  async findOneByEmailOrNull(
    email: string,
    manager?: EntityManager,
  ): Promise<Nullable<UserResponse>> {
    return this.userRepository.findByField('email', email, manager);
  }

  // todo: add validation for query error
  async create(createUserDto: CreateUserDto, manager?: EntityManager): Promise<UserResponse> {
    const existingUser = await this.userRepository.findByField(
      'email',
      createUserDto.email,
      manager,
    );
    if (existingUser) {
      throw new ConflictException(`User already exists`);
    }

    return this.userRepository.create(createUserDto, manager);
  }

  async update(userId: number, updateUserDto: UpdateUserDto): Promise<UserResponse> {
    const updatedUser = await this.userRepository.update(userId, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException(`User not found`);
    }

    return updatedUser;
  }

  async delete(userId: number): Promise<MessageResponse> {
    const deleteRes = await this.userRepository.delete(userId);

    if (deleteRes.affected === 0) {
      throw new NotFoundException(`User not found`);
    }

    return { message: 'User deleted successfully' };
  }
}
