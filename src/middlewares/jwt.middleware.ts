import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../token/token.service';

interface UserRequest extends Request {
  userId: string;
}

@Injectable()
export class JWTMiddleware implements NestMiddleware {
  constructor(private readonly tokenService: TokenService) {}

  use(req: UserRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.includes('Bearer')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userData = this.tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.userId = userData.id;
    next();
  }
}
