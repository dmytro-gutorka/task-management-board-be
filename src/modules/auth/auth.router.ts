import { Router } from 'express';
import { ConfirmPasswordResetSchema } from './schemas/confirm-password-reset.schema.js';
import { RequestPasswordResetSchema } from './schemas/request-password-reset.schema.js';
import { SignInLocalSchema } from './schemas/sign-in-local.schema.js';
import { SignUpLocalSchema } from './schemas/sign-up-local.schema.js';
import type { AccessTokenGuard } from './guards/access-token.guard.js';
import { RefreshTokenGuard } from './guards/refresh-token.guard.js';
import { AuthController } from './auth.controller.js';
import { validateBodyMiddleware } from '@validation-middlewares/validate-body.middleware.js';

export const createAuthRouter = (
  authController: AuthController,
  refreshTokenGuard: RefreshTokenGuard,
  accessTokenGuard: AccessTokenGuard,
): Router => {
  const authRouter = Router();

  authRouter.post('/sign-in', [validateBodyMiddleware(SignInLocalSchema)], authController.signIn);

  authRouter.post('/sign-up', [validateBodyMiddleware(SignUpLocalSchema)], authController.signUp);

  authRouter.get('/sign-out', [refreshTokenGuard.canActivate], authController.signOut);

  authRouter.get('/refresh', [refreshTokenGuard.canActivate], authController.refresh);

  authRouter.post(
    '/password-reset/request',
    [accessTokenGuard.canActivate, validateBodyMiddleware(RequestPasswordResetSchema)],
    authController.requestPasswordReset,
  );

  authRouter.post(
    '/password-reset/confirm',
    [validateBodyMiddleware(ConfirmPasswordResetSchema)],
    authController.confirmPasswordReset,
  );

  return authRouter;
};
