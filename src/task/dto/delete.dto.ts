import { IsString, Length } from "class-validator";

export class DeleteTaskDto {
  @IsString()
  @Length(24, 24)
  id: string;
};
