import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthorDto {
  @IsNotEmpty({ message: 'Author name cannot be empty' })
  @IsString({ message: 'Author name has to be a string' })
  name: string;
}
