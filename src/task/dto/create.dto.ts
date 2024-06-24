import { IsString, Length } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({example: "Some Task Title", description: "Task title"})
  @IsString()
  @Length(10, 20)
  title: string;

  @ApiProperty({
    example: "Some Task Description With More Text",
    description: "Task description"
  })
  @IsString()
  @Length(10, 400)
  description: string;
};
