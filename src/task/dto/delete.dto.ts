import { IsString, Length } from "class-validator";

export class DeleteTaskDto {
  @IsString({message: "ID must be a string"})
  @Length(24, 24, {message: "ID must be exactly 24 characters long"})
  id: string;
};
