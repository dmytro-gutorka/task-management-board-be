import type { GoogleAuthProviderService } from '@infrastructure/google-auth';
import type { ActiveUser, SignInGoogleDto, TokensPair } from '../types.js';
import { AuthProvider } from '../enums/auth-provider.enum.js';
import type { AuthRepository } from '../repositories/auth.repository.js';
import type { AuthRegistrationService } from './auth-registration.service.js';
import type { JwtService } from './jwt.service.js';

import { ConflictException } from '../../../shared/exceptions.js';

export class AuthGoogleService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly authRegistrationService: AuthRegistrationService,
    private readonly googleAuthProviderService: GoogleAuthProviderService,
  ) {}

  async signIn(signInGoogleDto: SignInGoogleDto): Promise<TokensPair> {
    const googleUser = await this.googleAuthProviderService.verifyCredential(
      signInGoogleDto.credential,
    );

    const existingGoogleAuth = await this.authRepository.findByProviderAndProviderAccountId(
      AuthProvider.GOOGLE,
      googleUser.providerAccountId,
    );

    if (existingGoogleAuth) {
      return this.signTokens(existingGoogleAuth.userId, existingGoogleAuth.email);
    }

    const existingLocalAuth = await this.authRepository.findByEmailAndProvider(
      googleUser.email,
      AuthProvider.LOCAL,
    );

    if (existingLocalAuth) {
      const googleAuth = await this.authRegistrationService.registerUserWithAuth({
        provider: AuthProvider.GOOGLE,
        email: googleUser.email,
        userId: existingLocalAuth.userId,
        providerAccountId: googleUser.providerAccountId,
      });

      return this.signTokens(googleAuth.userId, googleAuth.email);
    }

    const googleAuth = await this.authRegistrationService.registerUserWithAuth({
      provider: AuthProvider.GOOGLE,
      email: googleUser.email,
      name: googleUser.name ?? undefined,
      providerAccountId: googleUser.providerAccountId,
    });

    return this.signTokens(googleAuth.userId, googleAuth.email);
  }

  async link(activeUser: ActiveUser, signInGoogleDto: SignInGoogleDto): Promise<void> {
    const googleUser = await this.googleAuthProviderService.verifyCredential(
      signInGoogleDto.credential,
    );

    const existingGoogleAuth = await this.authRepository.findByProviderAndProviderAccountId(
      AuthProvider.GOOGLE,
      googleUser.providerAccountId,
    );

    if (existingGoogleAuth) {
      if (existingGoogleAuth.userId === activeUser.id) return;

      throw new ConflictException('This Google account is already linked to another user');
    }

    const currentUserGoogleAuth = await this.authRepository.findByUserIdAndProvider(
      activeUser.id,
      AuthProvider.GOOGLE,
    );

    if (currentUserGoogleAuth) {
      throw new ConflictException('Google account is already linked to this user');
    }

    await this.authRegistrationService.registerUserWithAuth({
      provider: AuthProvider.GOOGLE,
      email: googleUser.email,
      userId: activeUser.id,
      providerAccountId: googleUser.providerAccountId,
    });
  }

  private signTokens(userId: number, email: string): TokensPair {
    return this.jwtService.signTokensPair({
      id: userId,
      email,
      provider: AuthProvider.GOOGLE,
    });
  }
}
