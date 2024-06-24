import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  ConflictException,
  UsePipes,
  ValidationPipe,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException
} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {CreateUserDto} from "./dto/createUser.dto";
import {LoginUserDto} from "./dto/loginUser.dto";
import {Request, Response} from "express";

@Controller("")
export class AuthController {
  private maxAgeValue: number;

  constructor(private readonly authService: AuthService) {
    this.maxAgeValue = parseInt(process.env.JWT_TTL, 10) * 24 * 60 * 60 * 1000;
  }

  @UsePipes(new ValidationPipe())
  @Post("sign-up")
  async signUp(@Body() dto: CreateUserDto, @Res() res: Response) {
    try {
      const {name, email, password} = dto;
      const userData = await this.authService.register(name, email, password);
      res.cookie("refreshToken", userData.refreshToken, {maxAge: this.maxAgeValue, httpOnly: true});

      return res.status(201).json(userData);
    } catch (err) {
      throw new ConflictException(err.message);
    }
  }

  @UsePipes(new ValidationPipe())
  @Post("sign-in")
  async signIn(@Body() dto: LoginUserDto, @Res() res: Response) {
    try {
      const {email, password} = dto;
      const userData = await this.authService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, {maxAge: this.maxAgeValue, httpOnly: true});

      return res.status(200).json(userData);
    } catch (err) {
      if (err instanceof Error) {
        const [stsCode, errMsg] = err.message.split(":");
        const statusCode = parseInt(stsCode, 10);
        if (statusCode === 404) {
          throw new NotFoundException(errMsg);
        } else {
          throw new BadRequestException(errMsg);
        }
      }

      console.error(`Failed to login with email ${dto.email}`, err);
      throw new InternalServerErrorException();
    }
  }

  @Post("sign-out")
  async signOut(@Req() req: Request, @Res() res: Response) {
    try {
      const token = this.authService.getTokenFromHeaders(req.headers.cookie);

      await this.authService.logout(token);
      res.clearCookie("refreshToken");

      return res.status(200).json({});
    } catch (err) {
      console.error("Failed to sign out:", err);
      throw new InternalServerErrorException();
    }
  }

  @Get("refresh-token")
  async refresh(@Req() req: Request, @Res() res: Response) {
    try {
      const token = this.authService.getTokenFromHeaders(req.headers.cookie);
      const userData = await this.authService.refresh(token);

      res.cookie("refreshToken", userData.refreshToken, {maxAge: this.maxAgeValue, httpOnly: true});

      return res.status(200).json(userData);
    } catch (err) {
      if (err instanceof Error) {
        throw new UnauthorizedException();
      }

      console.error("Failed to sign out:", err);
      throw new InternalServerErrorException();
    }
  }
}
