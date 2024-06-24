import { IsString, Length } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({example: "Some Project", description: "Project's name"})
  @IsString()
  @Length(10, 100)
  name: string;
};
