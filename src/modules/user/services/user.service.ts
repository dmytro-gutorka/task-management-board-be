import type { DataSource, EntityManager } from 'typeorm';
import type { MessageResponse, Nullable } from '@types';
import type { CreateUserDto, UpdateUserDto, UploadUserAvatarDto, UserResponse } from '../types.js';
import type { UserEntity } from '../entities/user.entity.js';
import type { MediaRepository } from '../../media/repositories/media.repository.js';
import type { UserAvatarRepository } from '../../user-avatar/repositories/user-avatar.repository.js';
import type { UserRepository } from '../repositories/user.repository.js';
import { ConflictException, NotFoundException } from '@exceptions';

import type { MediaStorageService } from '../../../infrastructure/media-storage/index.js';
import { MediaStorageProvider, MediaType } from '../../../shared/enums/media.enums.js';
import { buildAvatarUploadFolderForUser } from '../helpers/buildAvatarUploadFolderForUser.js';

export class UserService {
  // eslint-disable-next-line max-params
  constructor(
    private readonly dataSource: DataSource,
    private readonly userRepository: UserRepository,
    private readonly mediaRepository: MediaRepository,
    private readonly userAvatarRepository: UserAvatarRepository,
    private readonly mediaStorageService: MediaStorageService,
  ) {}

  async findOne(id: number): Promise<UserResponse> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

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
    if (existingUser) {
      throw new ConflictException(`User already exists`);
    }

    const user = await this.userRepository.create(createUserDto, manager);
    return this.toUserResponse(user);
  }

  async update(userId: number, updateUserDto: UpdateUserDto): Promise<UserResponse> {
    const updatedUser = await this.userRepository.update(userId, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException(`User not found`);
    }

    return this.toUserResponse(updatedUser);
  }

  async uploadAvatar(userId: number, avatar: UploadUserAvatarDto): Promise<UserResponse> {
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const uploadedMedia = await this.mediaStorageService.upload({
      buffer: avatar.buffer,
      fileName: avatar.originalName,
      mimeType: avatar.mimeType,
      folder: buildAvatarUploadFolderForUser(userId),
      resourceType: MediaType.IMAGE,
    });

    await this.dataSource.transaction(async (manager) => {
      const media = await this.mediaRepository.create(
        {
          mediaType: MediaType.IMAGE,
          publicUrl: uploadedMedia.publicUrl,
          storageProvider: MediaStorageProvider.CLOUDINARY,
          storagePublicId: uploadedMedia.storagePublicId,
          mimeType: avatar.mimeType,
          originalName: avatar.originalName,
          sizeBytes: avatar.size,
        },
        manager,
      );

      await this.userAvatarRepository.create(userId, media.id, manager);
    });

    return this.findOne(userId);
  }

  async delete(userId: number): Promise<MessageResponse> {
    const avatars = await this.userAvatarRepository.findAllByUserId(userId);
    const mediaIds = avatars.map((avatar) => avatar.media.id);
    const storagePublicIds = avatars.map((avatar) => avatar.media.storagePublicId);

    const deleteRes = await this.userRepository.delete(userId);

    if (deleteRes.affected === 0) {
      throw new NotFoundException(`User not found`);
    }

    await this.mediaRepository.delete(mediaIds);

    await Promise.allSettled(
      storagePublicIds.map(async (storagePublicId) =>
        this.mediaStorageService.delete(storagePublicId),
      ),
    );

    return { message: 'User deleted successfully' };
  }

  private async toUserResponse(user: UserEntity): Promise<UserResponse> {
    const currentAvatar = await this.userAvatarRepository.findCurrentByUserId(user.id);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      birthday: user.birthday,
      avatarUrl: currentAvatar?.media.publicUrl ?? null,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
