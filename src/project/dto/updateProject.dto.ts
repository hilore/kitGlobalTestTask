import { IsString, Length } from "class-validator";

export class UpdateProjectDto {
  @IsString()
  @Length(24, 24, {message: "The project ID must be exactly 24 characters long"})
  taskId: string;
};
