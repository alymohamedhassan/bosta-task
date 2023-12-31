import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthorDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Author name cannot be empty' })
  @IsString({ message: 'Author name has to be a string' })
  name: string;
}
