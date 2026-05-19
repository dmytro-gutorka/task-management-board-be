import type { EntityManager } from 'typeorm';
import type { MessageResponse, Nullable, OmitDbMetaFiles } from '@types';
import type { CreateUserDto, UploadUserAvatarDto, UserAuthModel, UserResponse } from '../types.js';
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

  async findOneUserAuthModel(id: number, manager?: EntityManager): Promise<UserAuthModel> {
    const user = await this.userRepository.findOne(id, manager);

    if (!user) throw new NotFoundException(`User not found`);

    return this.toUserAuthModel(user);
  }

  async findOneUserAuthModelByEmailOrNull(
    email: string,
    manager?: EntityManager,
  ): Promise<Nullable<UserAuthModel>> {
    const user = await this.userRepository.findByField('email', email, manager);

    if (!user) return null;

    return this.toUserAuthModel(user);
  }

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

  async update(userId: number, user: Partial<OmitDbMetaFiles<UserEntity>>): Promise<UserResponse> {
    const updatedUser = await this.userRepository.update(userId, user);

    if (!updatedUser) throw new NotFoundException(`User not found`);

    return this.toUserResponse(updatedUser);
  }

  async updatePrimaryEmail(userId: number, email: string): Promise<UserResponse> {
    const existingUserWithEmail = await this.userRepository.findByField('email', email);

    if (existingUserWithEmail && existingUserWithEmail.id !== userId) {
      throw new ConflictException('Email is already used as primary email by another user');
    }

    const updatedUser = await this.userRepository.update(userId, { email });

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

    await this.userAvatarService.tryDeleteAllByUserId(user.id);

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

  private toUserAuthModel(user: UserEntity): UserAuthModel {
    return {
      id: user.id,
      email: user.email,
    };
  }
}
