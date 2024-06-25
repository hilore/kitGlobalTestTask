import { TokenService } from '../token/token.service';
import {
  Injectable,
  UnauthorizedException,
  CanActivate,
  ExecutionContext
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.includes('Bearer')) {
      throw new UnauthorizedException();
    }

    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      throw new UnauthorizedException();
    }

    const userData = this.tokenService.validateAccessToken(accessToken);
    if (!userData) {
      throw new UnauthorizedException();
    }

    req["userId"] = userData.id;

    return true;
  }
}
