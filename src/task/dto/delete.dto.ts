import { IsString, Length } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class DeleteTaskDto {
  @ApiProperty({example: "37281hhdsa73217321", description: "Task ID"})
  @IsString({message: "ID must be a string"})
  @Length(24, 24, {message: "ID must be exactly 24 characters long"})
  id: string;
};
