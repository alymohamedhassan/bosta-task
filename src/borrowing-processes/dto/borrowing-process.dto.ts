import { IsDate, IsNumber } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { BookDto } from "../../books/dto/book.dto";
import { CreateBorrowerDto } from "../../borrowers/dto/borrower.dto";

export class BorrowingProcessDto {
  @ApiProperty()
  bookId: number;

  @ApiProperty()
  book: BookDto;

  @ApiProperty()
  borrower: CreateBorrowerDto;

  @ApiProperty()
  borrowerId: number;

  @ApiProperty()
  returnDate: Date;

  @ApiProperty()
  borrowingDate: Date;
}

export class CreateBorrowingProcessDto {
  @ApiProperty()
  @IsNumber({}, {message: 'BookId field has to be a number'})
  bookId: number;

  @ApiProperty()
  @IsDate({message: 'returnDate has to be a valid date'})
  returnDate: Date
}

export class UpdateBorrowingProcessDto {
  @ApiProperty()
  @IsNumber({}, {message: 'BookId field has to be a number'})
  bookId: number;

  @ApiProperty()
  @IsDate({message: 'returnDate has to be a valid date'})
  returnDate: Date
}
