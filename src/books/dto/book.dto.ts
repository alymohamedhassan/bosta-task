import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateBookDto {
  @IsString({message: 'Title has to be a string'})
  @IsNotEmpty({message: 'Title should not be empty'})
  @ApiProperty()
  title: string;

  @ApiProperty()
  @IsString({message: 'ISBN has to be a string'})
  @IsNotEmpty({message: 'ISBN should not be empty'})
  isbn: string;

  @ApiProperty({minimum: 1})
  authorId: number;

  @ApiProperty()
  shelfLocation: string;

  @ApiProperty({minimum: 0})
  @IsNumber({}, {message: 'Total Quantity has to be a positive number'})
  @IsInt({message: 'Total Quantity has to be an integer'})
  totalQuantity: number;
}


export class BookDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  isbn: string;

  @ApiProperty()
  authorId: number;

  @ApiProperty()
  shelfLocation: string;

  @ApiProperty()
  totalQuantity: number;
}

export class UpdateBookDto {
  @ApiProperty()
  @IsOptional()
  @IsString({message: 'Title has to be a string'})
  @IsNotEmpty({message: 'Title should not be empty'})
  title: string;

  @ApiProperty()
  @IsOptional()
  isbn: string;

  @ApiProperty()
  @IsOptional()
  authorId: number;

  @ApiProperty()
  @IsOptional()
  shelfLocation: string;

  @ApiProperty()
  @IsOptional()
  totalQuantity: number;
}
