import type { AuthModuleComposerArgs } from './types.js';
import { AccessTokenGuard } from './guards/access-token.guard.js';
import { RefreshTokenGuard } from './guards/refresh-token.guard.js';
import { AuthRepository } from './repositories/auth.repository.js';
import { PasswordResetTokenRepository } from './repositories/password-reset-token.repository.js';
import { AuthService } from './services/auth.service.js';
import { AuthGoogleService } from './services/auth-google.service.js';
import { AuthLocalService } from './services/auth-local.service.js';
import { AuthRegistrationService } from './services/auth-registration.service.js';
import { CookiesService } from './services/cookies.service.js';
import { CryptoService } from './services/crypto.service.js';
import { JwtService } from './services/jwt.service.js';
import { PasswordResetService } from './services/password-reset.service.js';
import { AuthController } from './auth.controller.js';
import { createAuthRouter } from './auth.router.js';

export const runAuthModuleComposer = ({
  dataSource,
  userService,
  configService,
  emailOutboxService,
  googleAuthProviderService,
}: AuthModuleComposerArgs) => {
  const jwtService = new JwtService(configService);
  const cryptoService = new CryptoService(configService);
  const cookiesService = new CookiesService(configService);

  const authRepository = new AuthRepository(dataSource);
  const passwordResetTokenRepository = new PasswordResetTokenRepository(dataSource);

  const authRegistrationService = new AuthRegistrationService(
    dataSource,
    userService,
    cryptoService,
    authRepository,
  );

  const authService = new AuthService(jwtService, authRepository);
  const authLocalService = new AuthLocalService(
    jwtService,
    cryptoService,
    authRepository,
    authRegistrationService,
  );
  const authGoogleService = new AuthGoogleService(
    jwtService,
    authRepository,
    authRegistrationService,
    googleAuthProviderService,
  );

  const passwordResetService = new PasswordResetService(
    dataSource,
    authService,
    passwordResetTokenRepository,
    emailOutboxService,
    cryptoService,
    configService,
  );

  const refreshTokenGuard = new RefreshTokenGuard(jwtService);
  const accessTokenGuard = new AccessTokenGuard(jwtService);

  const authController = new AuthController({
    authService,
    cookiesService,
    authLocalService,
    authGoogleService,
    passwordResetService,
  });

  const authRouter = createAuthRouter(authController, refreshTokenGuard, accessTokenGuard);

  return { authRouter, accessTokenGuard };
};
