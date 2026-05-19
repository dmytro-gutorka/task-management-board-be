import type { DataSource, DeleteResult, EntityManager, Repository } from 'typeorm';
import type { Nullable, OmitDbMetaFiles } from '@types';
import type { CreateUserDto } from '../types.js';
import { UserEntity } from '../entities/user.entity.js';

export class UserRepository {
  private readonly userRepository: Repository<UserEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.userRepository = this.dataSource.getRepository(UserEntity);
  }

  async findOne(id: UserEntity['id'], manager?: EntityManager): Promise<Nullable<UserEntity>> {
    return this.getRepository(manager).findOneBy({ id });
  }

  async findByField<Field extends keyof UserEntity>(
    field: Field,
    value: UserEntity[Field],
    manager?: EntityManager,
  ): Promise<Nullable<UserEntity>> {
    const repository = this.getRepository(manager);
    return repository.findOne({ where: { [field]: value } });
  }

  async create(user: CreateUserDto, manager?: EntityManager): Promise<UserEntity> {
    const repository = this.getRepository(manager);
    return repository.save(user);
  }

  async update(
    id: UserEntity['id'],
    user: Partial<OmitDbMetaFiles<UserEntity>>,
  ): Promise<Nullable<UserEntity>> {
    const updatedUser = await this.userRepository.preload({ id, ...user });
    if (!updatedUser) return null;

    return this.userRepository.save(updatedUser);
  }

  async delete(id: UserEntity['id']): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }

  private getRepository(manager?: EntityManager) {
    return manager ? manager.getRepository(UserEntity) : this.userRepository;
  }
}
