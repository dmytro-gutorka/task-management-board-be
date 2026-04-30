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

  async registerUser({ provider, email, password }: AuthRegisterPayload): Promise<AuthEntity> {
    /* TRANSACTION */
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const manager = queryRunner.manager;

      // Create or get a user record
      let user = await this.userService.findOneByEmailOrNull(email, manager);

      // hash the password
      let hashedPassword: Nullable<string> = null;
      if (password) {
        hashedPassword = await this.cryptoService.hash(password);
      }

      if (!user) {
        user = await this.userService.create({ email }, manager);
      }

      // create an auth record
      const auth = await this.authRepository.create(
        {
          userId: user.id,
          email: user.email,
          password: hashedPassword,
          provider,
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
