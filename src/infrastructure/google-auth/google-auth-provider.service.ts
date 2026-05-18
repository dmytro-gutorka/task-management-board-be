import type { ConfigService } from '@infrastructure/config-service';
import type { GoogleAuthProviderService, GoogleUserPayload } from './types.js';
import { UnauthorizedException } from '@exceptions';

import { OAuth2Client, type TokenPayload } from 'google-auth-library';

export class GoogleAuthProviderServiceImpl implements GoogleAuthProviderService {
  private readonly client: OAuth2Client;

  constructor(private readonly configService: ConfigService) {
    this.client = new OAuth2Client(this.configService.env.GOOGLE_CLIENT_ID);
  }

  async verifyCredential(credential: string): Promise<GoogleUserPayload> {
    let payload: TokenPayload | undefined;

    try {
      const ticket = await this.client.verifyIdToken({
        idToken: credential,
        audience: this.configService.env.GOOGLE_CLIENT_ID,
      });

      payload = ticket.getPayload();
    } catch {
      throw new UnauthorizedException('Invalid Google credential');
    }

    if (!payload?.sub || !payload.email) {
      throw new UnauthorizedException('Invalid Google credential');
    }

    return {
      providerAccountId: payload.sub,
      email: payload.email,
      name: payload.name ?? null,
    };
  }
}
