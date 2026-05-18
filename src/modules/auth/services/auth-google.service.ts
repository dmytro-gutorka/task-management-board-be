import type { GoogleAuthProviderService } from '@infrastructure/google-auth';
import type { SignInGoogleDto, TokensPair } from '../types.js';
import { AuthProvider } from '../enums/auth-provider.enum.js';
import type { AuthRepository } from '../repositories/auth.repository.js';
import type { AuthRegistrationService } from './auth-registration.service.js';
import type { JwtService } from './jwt.service.js';
import { ConflictException } from '@exceptions';

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
      const googleAuth = await this.authRegistrationService.registerUser({
        provider: AuthProvider.GOOGLE,
        email: googleUser.email,
        userId: existingLocalAuth.userId,
        providerAccountId: googleUser.providerAccountId,
      });

      return this.signTokens(googleAuth.userId, googleAuth.email);
    }

    const existingAuthWithSameEmail = await this.authRepository.findByEmail(googleUser.email);

    if (existingAuthWithSameEmail) {
      throw new ConflictException('Account with this email already exists');
    }

    const googleAuth = await this.authRegistrationService.registerUser({
      provider: AuthProvider.GOOGLE,
      email: googleUser.email,
      name: googleUser.name ?? undefined,
      providerAccountId: googleUser.providerAccountId,
    });

    return this.signTokens(googleAuth.userId, googleAuth.email);
  }

  private signTokens(userId: number, email: string): TokensPair {
    return this.jwtService.signTokensPair({
      id: userId,
      email,
      provider: AuthProvider.GOOGLE,
    });
  }
}
