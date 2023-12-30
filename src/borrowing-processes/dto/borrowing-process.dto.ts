import { PartialType } from '@nestjs/mapped-types';
import { IsDate, IsNumber } from "class-validator";

export class CreateBorrowingProcessDto {
  @IsNumber({}, {message: 'BookId field has to be a number'})
  bookId: number;

  @IsNumber({}, {message: 'BookId field has to be a number'})
  borrowerId: number;

  @IsDate({message: 'returnDate has to be a valid date'})
  returnDate: Date
}

export class UpdateBorrowingProcessDto extends PartialType(CreateBorrowingProcessDto) {}
