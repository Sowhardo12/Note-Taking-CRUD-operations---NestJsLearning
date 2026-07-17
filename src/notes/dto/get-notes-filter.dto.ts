import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetNotesFilterDto {
  @ApiPropertyOptional({ description: 'Filter notes by a matching substring in the title' })
  @IsOptional()
  @IsString()
  search?: string;
}