import type { EntityManager } from 'typeorm';
import type { MessageResponse, Nullable } from '@types';
import type { CreateUserDto, UpdateUserDto, UploadUserAvatarDto, UserResponse } from '../types.js';
import type { UserEntity } from '../entities/user.entity.js';
import type { UserRepository } from '../repositories/user.repository.js';
import type { UserAvatarService } from '../../media/services/user-avatar.service.js';
import { ConflictException, NotFoundException } from '@exceptions';

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userAvatarService: UserAvatarService,
  ) {}

  async findOne(id: number): Promise<UserResponse> {
    const user = await this.userRepository.findOne(id);

    if (!user) throw new NotFoundException(`User not found`);

    return this.toUserResponse(user);
  }

  async findOneByEmailOrNull(
    email: string,
    manager?: EntityManager,
  ): Promise<Nullable<UserResponse>> {
    const user = await this.userRepository.findByField('email', email, manager);

    if (!user) return null;

    return this.toUserResponse(user);
  }

  // todo: add validation for query error
  async create(createUserDto: CreateUserDto, manager?: EntityManager): Promise<UserResponse> {
    const existingUser = await this.userRepository.findByField(
      'email',
      createUserDto.email,
      manager,
    );
    if (existingUser) throw new ConflictException(`User already exists`);

    const user = await this.userRepository.create(createUserDto, manager);

    return this.toUserResponse(user);
  }

  async update(userId: number, updateUserDto: UpdateUserDto): Promise<UserResponse> {
    const updatedUser = await this.userRepository.update(userId, updateUserDto);

    if (!updatedUser) throw new NotFoundException(`User not found`);

    return this.toUserResponse(updatedUser);
  }

  async uploadAvatar(userId: number, avatar: UploadUserAvatarDto): Promise<UserResponse> {
    const user = await this.userRepository.findOne(userId);

    if (!user) throw new NotFoundException(`User not found`);

    await this.userAvatarService.uploadUserAvatar(user.id, avatar);

    return this.findOne(user.id);
  }

  async delete(userId: number): Promise<MessageResponse> {
    const user = await this.userRepository.findOne(userId);
    if (!user) throw new NotFoundException(`User not found`);

    try {
      await this.userAvatarService.deleteAllByUserId(user.id);
    } catch {
      /* empty */
    }

    const deletedUser = await this.userRepository.delete(user.id);

    if (deletedUser.affected === 0) throw new NotFoundException(`User not found`);

    return { message: 'User deleted successfully' };
  }

  private async toUserResponse(user: UserEntity): Promise<UserResponse> {
    const avatarUrl = await this.userAvatarService.getCurrentAvatarUrl(user.id);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      birthday: user.birthday,
      avatarUrl,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
