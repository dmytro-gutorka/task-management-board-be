import type { EntityManager } from 'typeorm';
import type { ActiveUser } from '../types.js';
import { AuthProvider } from '../enums/auth-provider.enum.js';
import type { AuthEntity } from '../entities/auth.entity.js';
import type { AuthRepository } from '../repositories/auth.repository.js';
import type { JwtService } from './jwt.service.js';

import { NotFoundException } from '../../../shared/exceptions.js';

export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}

  async findLocalAuthByUserId(userId: number, manager?: EntityManager): Promise<AuthEntity> {
    const auth = await this.authRepository.findByUserIdAndProvider(
      userId,
      AuthProvider.LOCAL,
      manager,
    );

    if (!auth) {
      throw new NotFoundException('Auth account not found');
    }

    return auth;
  }

  async updatePassword(
    authId: number,
    passwordHash: string,
    manager?: EntityManager,
  ): Promise<void> {
    await this.authRepository.updatePassword(authId, passwordHash, manager);
  }
  refreshToken(activeUser: ActiveUser) {
    return this.jwtService.signTokensPair(activeUser);
  }
}
