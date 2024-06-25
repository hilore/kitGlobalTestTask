import { IsString, Length, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiProperty({
    example: 'Some New Title',
    description: 'Task title (optional)',
  })
  @IsOptional()
  @IsString()
  @Length(10, 20)
  title?: string;

  @ApiProperty({
    example: 'Some New Description 2',
    description: 'Task description (optional)',
  })
  @IsOptional()
  @IsString()
  @Length(10, 400)
  description?: string;

  @ApiProperty({
    example: 'in progress',
    description: 'Task status (optional)',
  })
  @IsOptional()
  @IsEnum(['OPEN', 'IN_PROGRESS', 'DONE'])
  @Length(4, 11)
  status?: string;
}
