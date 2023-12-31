import { IsDate, IsNumber } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

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
