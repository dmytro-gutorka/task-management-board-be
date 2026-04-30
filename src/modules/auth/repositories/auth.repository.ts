import type { DataSource, EntityManager, Repository } from 'typeorm';
import type { Nullable } from '@types';
import { type CreateAuthDto, type UpdateAuthDto } from '../types.js';
import type { AuthProvider } from '../enums/auth-provider.enum.js';
import { AuthEntity } from '../entities/auth.entity.js';
import { NotFoundException } from '@exceptions';

export class AuthRepository {
  private readonly authRepository: Repository<AuthEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.authRepository = this.dataSource.getRepository(AuthEntity);
  }

  async create(createAuthDto: CreateAuthDto, manager?: EntityManager): Promise<AuthEntity> {
    const repository = this.getRepository(manager);
    const auth = repository.create(createAuthDto);
    return repository.save(auth);
  }

  async findByEmailAndProvider(
    email: string,
    provider: AuthProvider,
  ): Promise<Nullable<AuthEntity>> {
    return this.authRepository.findOneBy({ email, provider });
  }

  async update(id: number, updateAuthDto: UpdateAuthDto): Promise<AuthEntity> {
    const entity = await this.authRepository.preload({
      id,
      ...updateAuthDto,
    });

    if (!entity) {
      throw new NotFoundException(`Auth with id ${id} not found`);
    }

    return this.authRepository.save(entity);
  }

  private getRepository(manager?: EntityManager) {
    return manager ? manager.getRepository(AuthEntity) : this.authRepository;
  }
}
