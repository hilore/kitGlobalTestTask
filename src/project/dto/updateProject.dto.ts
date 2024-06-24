import { IsString, Length } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectDto {
  @ApiProperty({example: "773912897832719yas2", description: "Task ID"})
  @IsString()
  @Length(24, 24, {message: "The project ID must be exactly 24 characters long"})
  taskId: string;
};
