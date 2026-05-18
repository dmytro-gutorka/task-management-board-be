import type { DataSource, EntityManager, Repository } from 'typeorm';
import type { Nullable } from '@types';
import type { CreateAuthDto } from '../types.js';
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

  async findByEmail(email: string, manager?: EntityManager): Promise<Nullable<AuthEntity>> {
    return this.getRepository(manager).findOneBy({ email });
  }

  async findByEmailAndProvider(
    email: string,
    provider: AuthProvider,
    manager?: EntityManager,
  ): Promise<Nullable<AuthEntity>> {
    return this.getRepository(manager).findOneBy({ email, provider });
  }

  async findByProviderAndProviderAccountId(
    provider: AuthProvider,
    providerAccountId: string,
    manager?: EntityManager,
  ): Promise<Nullable<AuthEntity>> {
    return this.getRepository(manager).findOneBy({ provider, providerAccountId });
  }

  async findByUserIdAndProvider(
    userId: number,
    provider: AuthProvider,
    manager?: EntityManager,
  ): Promise<Nullable<AuthEntity>> {
    return this.getRepository(manager).findOneBy({ userId, provider });
  }

  async updatePassword(id: number, passwordHash: string, manager?: EntityManager): Promise<void> {
    const result = await this.getRepository(manager).update(id, {
      password: passwordHash,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Auth with id ${id} not found`);
    }
  }

  private getRepository(manager?: EntityManager) {
    return manager ? manager.getRepository(AuthEntity) : this.authRepository;
  }
}
