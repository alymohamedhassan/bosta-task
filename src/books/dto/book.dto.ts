import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from "class-validator";

export class CreateBookDto {
  @IsString({message: 'Title has to be a string'})
  @IsNotEmpty({message: 'Title should not be empty'})
  title: string;

  isbn: string;
  authorId: number;
  shelfLocation: string;
  totalQuantity: number;
}


export class BookDto {
  title: string;
  isbn: string;
  authorId: number;
  shelfLocation: string;
  totalQuantity: number;
}

export class UpdateBookDto extends PartialType(CreateBookDto) {}
