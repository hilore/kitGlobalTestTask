import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  HttpCode,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { Request, Response } from 'express';
import {AllExceptionsFilter} from "../exceptions/AllExceptionsFilter";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('auth')
@UseFilters(AllExceptionsFilter)
@Controller('')
export class AuthController {
  private maxAgeValue: number;

  constructor(private readonly authService: AuthService) {
    this.maxAgeValue = parseInt(process.env.JWT_TTL, 10) * 24 * 60 * 60 * 1000;
  }

  @UsePipes(new ValidationPipe())
  @Post('sign-up')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully registered',
  })
  @ApiResponse({ status: 409, description: 'Conflict' })
  async signUp(@Body() dto: CreateUserDto, @Res() res: Response) {
    const { name, email, password } = dto;
    const userData = await this.authService.register(name, email, password);

    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: this.maxAgeValue,
      httpOnly: true,
    });

    return res.status(201).json(userData);
  }

  @UsePipes(new ValidationPipe())
  @Post('sign-in')
  @HttpCode(200)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged in',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async signIn(@Body() dto: LoginUserDto, @Res() res: Response) {
    const { email, password } = dto;
    const userData = await this.authService.login(email, password);

    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: this.maxAgeValue,
      httpOnly: true,
    });

    return res.status(200).json(userData);
  }

  @ApiBearerAuth()
  @Post('sign-out')
  @HttpCode(200)
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged out',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async signOut(@Req() req: Request, @Res() res: Response) {
    const token = this.authService.getTokenFromHeaders(req.headers.cookie);

    await this.authService.logout(token);
    res.clearCookie('refreshToken');

    return res.status(200).json({});
  }

  @ApiBearerAuth()
  @Get('refresh-token')
  @ApiOperation({ summary: 'Refresh token' })
  @ApiResponse({
    status: 200,
    description: 'The token has been successfully refreshed',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async refresh(@Req() req: Request, @Res() res: Response) {
    const token = this.authService.getTokenFromHeaders(req.headers.cookie);
    const userData = await this.authService.refresh(token);

    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: this.maxAgeValue,
      httpOnly: true,
    });

    return res.status(200).json(userData);
  }
}
