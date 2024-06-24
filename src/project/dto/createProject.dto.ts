import { IsString, Length } from "class-validator";

export class CreateProjectDto {
  @IsString()
  @Length(10, 100)
  name: string;
};
