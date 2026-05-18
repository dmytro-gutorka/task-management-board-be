import type { DataSource } from 'typeorm';
import type { UserService } from '@modules/user';
import type { Nullable } from '@types';
import type { AuthRegisterPayload } from '../types.js';
import type { AuthEntity } from '../entities/auth.entity.js';
import type { AuthRepository } from '../repositories/auth.repository.js';
import type { CryptoService } from './crypto.service.js';

export class AuthRegistrationService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly cryptoService: CryptoService,
    private readonly authRepository: AuthRepository,
  ) {}

  async registerUser({
    provider,
    email,
    password,
    userId,
    providerAccountId = null,
    name,
  }: AuthRegisterPayload): Promise<AuthEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const manager = queryRunner.manager;
      let authUserId = userId;

      if (!authUserId) {
        const existingUser = await this.userService.findOneUserAuthModelByEmailOrNull(
          email,
          manager,
        );
        const user = existingUser ?? (await this.userService.create({ email, name }, manager));

        authUserId = user.id;
      }

      let hashedPassword: Nullable<string> = null;
      if (password) {
        hashedPassword = await this.cryptoService.hash(password);
      }

      const auth = await this.authRepository.create(
        {
          userId: authUserId,
          email,
          password: hashedPassword,
          provider,
          providerAccountId,
        },
        manager,
      );
      await queryRunner.commitTransaction();

      return auth;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
