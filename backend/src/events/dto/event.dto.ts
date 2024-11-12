import { IsString, IsNotEmpty, IsDate, IsOptional, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  start: Date;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  end: Date;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsUrl()
  @IsOptional()
  videoUrl?: string;
}

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  start?: Date;

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  end?: Date;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsUrl()
  @IsOptional()
  videoUrl?: string;
}
