import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Token } from './schemas/token.schema';
import TokenDto from './dto/token.dto';

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

type Payload = {
  id: string;
};

@Injectable()
export class TokenService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;

  constructor(@InjectModel(Token.name) private model: Model<Token>) {
    this.accessTokenSecret = process.env.JWT_ACCESS_SECRET;
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
  }

  generateTokens(payload: Payload): Tokens {
    const ttl = process.env.JWT_TTL;

    const accessToken = jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: `${ttl}m`,
    });
    const refreshToken = jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: `${ttl}d`,
    });

    return { accessToken, refreshToken };
  }

  async saveToken(userId: string, refreshToken: string): Promise<TokenDto> {
    const tokenData = await this.model.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      await tokenData.save();

      return new TokenDto(tokenData);
    }

    const token = new this.model({ user: userId, refreshToken });
    await token.save();

    return new TokenDto(token);
  }

  async findToken(refreshToken: string): Promise<TokenDto> {
    const tokenData = await this.model.findOne({ refreshToken });
    if (!tokenData) {
      return null;
    }

    return new TokenDto(tokenData);
  }

  async removeToken(refreshToken: string): Promise<object> {
    await this.model.findOneAndDelete({ refreshToken }).exec();
    return {};
  }

  validateAccessToken(token: string): any {
    try {
      const userData = jwt.verify(token, this.accessTokenSecret);
      return userData;
    } catch (err) {
      console.error(`Failed to validate access token:`, err);
      return null;
    }
  }

  validateRefreshToken(token: string): any {
    try {
      const userData = jwt.verify(token, this.refreshTokenSecret);
      return userData;
    } catch (err) {
      console.error(`Failed to validate refresh token:`, err);
      return null;
    }
  }
}
