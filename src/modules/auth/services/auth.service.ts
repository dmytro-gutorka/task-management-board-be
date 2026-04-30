import type { ActiveUser } from '../types.js';
import type { JwtService } from './jwt.service.js';

export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  refreshToken(activeUser: ActiveUser) {
    return this.jwtService.signTokensPair(activeUser);
  }
}
