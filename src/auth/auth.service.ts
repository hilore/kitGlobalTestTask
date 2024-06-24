import { Injectable } from '@nestjs/common';
import {TokenService} from "../token/token.service";
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {User} from "./schemas/user.schema";
import {UserTokenDto} from "./dto/user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly tokenService: TokenService
  ) {}

  async register(name: string, email: string, password: string): Promise<UserTokenDto> {
    const candidate = await this.userModel.findOne({email});
    if (candidate) {
      throw new Error("User with such email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 4);
    const user = new this.userModel({name, email, password: hashedPassword});
    await user.save();

    const tokens = this.tokenService.generateTokens({id: user.id});
    await this.tokenService.saveToken(user.id, tokens.refreshToken);

    return new UserTokenDto(user, tokens);
  }

  async login(email: string, password: string): Promise<UserTokenDto> {
    const user = await this.userModel.findOne({email});
    if (!user) {
      throw new Error("404:User with such email does not exists");
    }

    const isPwdValid = await bcrypt.compare(password, user.password);
    if (!isPwdValid) {
      throw new Error("400:Incorrect password");
    }

    const tokens = this.tokenService.generateTokens({id: user.id});
    await this.tokenService.saveToken(user.id, tokens.refreshToken);

    return new UserTokenDto(user, tokens);
  }

  async logout(refreshToken: string): Promise<object> {
    await this.tokenService.removeToken(refreshToken);
    return {};
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new Error("Unauthorized");
    }

    const userData = this.tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw new Error("Unauthorized");
    }

    await this.tokenService.removeToken(refreshToken);
    const user = await this.userModel.findById(userData.id);

    const tokens = this.tokenService.generateTokens({id: user.id});
    await this.tokenService.saveToken(user.id, tokens.refreshToken);

    return new UserTokenDto(user, tokens);
  }

  getTokenFromHeaders(cookie: string): string {
    let token = "";
    const cookies = cookie.split(";");

    for (const c of cookies) {
      if (c.includes("refreshToken")) {
        const tmp = c.split("=");
        token = tmp[tmp.length - 1];
        break;
      }
    }

    return token;
  }
};
