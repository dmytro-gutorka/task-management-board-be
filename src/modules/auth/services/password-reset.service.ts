import type { DataSource } from 'typeorm';
import type {
  ActiveUser,
  ConfirmPasswordResetDto,
  PasswordResetRequestResponse,
} from '../types.js';
import type { PasswordResetTokenRepository } from '../repositories/password-reset-token.repository.js';
import type { AuthService } from './auth.service.js';
import type { CryptoService } from './crypto.service.js';

import type { ConfigService } from '../../../infrastructure/config-service/index.js';
import { BadRequestException } from '../../../shared/exceptions.js';
import { EmailOutboxService } from '../../notification/index.js';
import {
  buildPasswordResetEmailHtml,
  buildPasswordResetEmailText,
  buildPasswordResetUrl,
} from '../helpers/password-reset-email.helpers.js';
import {
  generatePasswordResetToken,
  hashPasswordResetToken,
} from '../helpers/password-reset-token.helpers.js';

export class PasswordResetService {
  // eslint-disable-next-line max-params
  constructor(
    private readonly dataSource: DataSource,
    private readonly authService: AuthService,
    private readonly passwordResetTokenRepository: PasswordResetTokenRepository,
    private readonly emailOutboxService: EmailOutboxService,
    private readonly cryptoService: CryptoService,
    private readonly configService: ConfigService,
  ) {}

  async requestAuthenticatedPasswordReset(
    activeUser: ActiveUser,
  ): Promise<PasswordResetRequestResponse> {
    const auth = await this.authService.findLocalAuthByUserId(activeUser.id);
    const resetToken = generatePasswordResetToken(
      this.configService.env.RESET_PASSWORD_TOKEN_BYTES,
    );
    const tokenHash = hashPasswordResetToken(resetToken);
    const expiresAt = new Date(Date.now() + this.configService.env.RESET_PASSWORD_TOKEN_TTL_MS);
    const resetUrl = buildPasswordResetUrl(this.configService.env.APP_FRONTEND_URL, resetToken);

    await this.dataSource.transaction(async (manager) => {
      await this.passwordResetTokenRepository.revokeActiveByUserId(activeUser.id, manager);

      await this.passwordResetTokenRepository.create(
        {
          userId: activeUser.id,
          authId: auth.id,
          tokenHash,
          expiresAt,
        },
        manager,
      );

      await this.emailOutboxService.enqueue({
        recipientEmail: activeUser.email,
        subject: 'Reset your password',
        htmlBody: buildPasswordResetEmailHtml(resetUrl),
        textBody: buildPasswordResetEmailText(resetUrl),
        manager,
      });
    });

    return {
      message: 'Password reset link sent',
    };
  }

  async confirmPasswordReset(confirmPasswordResetDto: ConfirmPasswordResetDto): Promise<void> {
    const tokenHash = hashPasswordResetToken(confirmPasswordResetDto.token);
    const passwordResetToken = await this.passwordResetTokenRepository.findByTokenHash(tokenHash);

    if (!passwordResetToken) throw new BadRequestException('Reset token is invalid or expired');

    if (passwordResetToken.usedAt || passwordResetToken.revokedAt)
      throw new BadRequestException('Reset token is invalid or expired');

    if (passwordResetToken.expiresAt.getTime() <= Date.now())
      throw new BadRequestException('Reset token is invalid or expired');

    const hashedPassword = await this.cryptoService.hash(confirmPasswordResetDto.newPassword);

    await this.dataSource.transaction(async (manager) => {
      await this.authService.updatePassword(passwordResetToken.authId, hashedPassword, manager);
      await this.passwordResetTokenRepository.markUsed(passwordResetToken.id, manager);
    });
  }
}
