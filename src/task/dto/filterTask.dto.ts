import { IsOptional, IsString, IsEnum } from 'class-validator';

export class FilterTaskDto {
  @IsOptional()
  @IsEnum(['OPEN', 'IN_PROGRESS', 'DONE'])
  status?: string;

  @IsOptional()
  @IsString()
  project?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: "ASC" | "DESC";
};
