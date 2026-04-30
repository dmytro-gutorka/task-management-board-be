import jwt from 'jsonwebtoken';
import type { ConfigService } from '@infrastructure/config-service';
import type { ActiveUser, TokensPair } from '../types.js';
import { ActiveUserSchema } from '../schemas/active-user.schema.js';
import { UnauthorizedException } from '@exceptions';

export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  signAccessToken(payload: ActiveUser): string {
    return jwt.sign(payload, this.configService.env.JWT_SECRET, {
      expiresIn: this.configService.env.ACCESS_TOKEN_TTL,
    });
  }

  signRefreshToken(payload: ActiveUser): string {
    return jwt.sign(payload, this.configService.env.JWT_SECRET, {
      expiresIn: this.configService.env.REFRESH_TOKEN_TTL,
    });
  }

  signTokensPair(payload: ActiveUser): TokensPair {
    const accessToken = this.signAccessToken(payload);
    const refreshToken = this.signRefreshToken(payload);

    return { accessToken, refreshToken };
  }

  async verify(token: string): Promise<ActiveUser> {
    try {
      const decoded = jwt.verify(token, this.configService.env.JWT_SECRET);

      return await ActiveUserSchema.parseAsync(decoded);
    } catch (_err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
