import { IsString, Length } from "class-validator";

export class CreateTaskDto {
  @IsString({message: "User ID must be a string"})
  @Length(24, 24, {message: "User ID must be exactly 24 characters long"})
  userId: string;

  @IsString()
  @Length(10, 20)
  title: string;

  @IsString()
  @Length(10, 400)
  description: string;
};
