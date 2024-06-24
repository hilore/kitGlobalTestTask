import { IsString, Length, IsOptional } from "class-validator";

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @Length(10, 20)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(10, 400)
  description?: string;
};
