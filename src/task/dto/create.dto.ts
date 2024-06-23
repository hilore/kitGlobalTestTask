import { IsString, Length } from "class-validator";

export class CreateTaskDto {
  @IsString()
  @Length(10, 20)
  title: string;

  @IsString()
  @Length(10, 400)
  description: string;
};
