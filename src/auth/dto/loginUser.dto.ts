import { IsString, Length } from "class-validator";

export class LoginUserDto {
  @IsString()
  @Length(4, 50)
  email: string;

  @IsString()
  @Length(8, 14)
  password: string;
};
