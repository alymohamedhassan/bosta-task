import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateBorrowerDto {
  @ApiProperty()
  @IsString({message: 'Name has to be a string'})
  name: string;

  @ApiProperty()
  @IsString({message: 'Email has to be a string'})
  @IsEmail({message: 'Email not valid'})
  email: string;

  @ApiProperty()
  @IsString({message: 'Password has to be a string'})
  password: string;
}

export class UpdateBorrowerDto {
  @ApiProperty()
  @IsString({message: 'Name has to be a string'})
  name: string;

  @ApiProperty()
  @IsString({message: 'Email has to be a string'})
  @IsEmail({message: 'Email not valid'})
  email: string;

  @ApiProperty()
  @IsString({message: 'Password has to be a string'})
  password: string;
}
