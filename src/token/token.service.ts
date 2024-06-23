import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Token } from './schemas/token.schema';
import * as jwt from 'jsonwebtoken';

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class TokenService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;

  constructor(@InjectModel(Token.name) private model: Model<Token>) {
    this.accessTokenSecret = process.env.JWT_ACCESS_SECRET;
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
  }

  generateToken(payload: any): Tokens {
    const accessToken = jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: '40m',
    });
    const refreshToken = jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: '40d',
    });

    return { accessToken, refreshToken };
  }

  async saveToken(userId: string, refreshToken: string): Promise<any> {
    const tokenData = await this.model.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }

    const token = new this.model({ user: userId, refreshToken });
    console.log(token);
    return token;
  }

  async findToken(refreshToken: string): Promise<any> {
    const tokenData = await this.model.findOne({ refreshToken });
    console.log('FIND');
    console.log(tokenData);
    return tokenData;
  }

  async removeToken(refreshToken: string): Promise<object> {
    await this.model.findOneAndDelete({ refreshToken }).exec();
    return {};
  }

  validateAccessToken(token: string): any {
    try {
      const userData = jwt.verify(token, this.accessTokenSecret);
      console.log(userData);
      return userData;
    } catch (err) {
      console.error(`FAILED TO VALIDATE ACCESS TOKEN:`, err);
      return null;
    }
  }

  validateRefreshToken(token: string): any {
    try {
      const userData = jwt.verify(token, this.refreshTokenSecret);
      console.log(userData);
      return userData;
    } catch (err) {
      console.error(`FAILED TO VALIDATE REFRESH TOKEN:`, err);
      return null;
    }
  }
}
