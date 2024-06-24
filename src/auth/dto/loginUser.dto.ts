import { IsString, Length } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({example: "johnd@mail.com", description: "User's email"})
  @IsString()
  @Length(4, 50)
  email: string;

  @ApiProperty({example: "pass12321dsaodwa", description: "User's password"})
  @IsString()
  @Length(8, 14)
  password: string;
};
