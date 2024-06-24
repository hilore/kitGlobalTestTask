import { IsString, Length } from "class-validator";

export class CreateUserDto {
  @IsString()
  @Length(4, 50)
  name: string;

  @IsString()
  @Length(4, 50)
  email: string;

  @IsString()
  @Length(8, 14)
  password: string;
};
