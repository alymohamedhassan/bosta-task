import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { CreateBorrowerDto } from "../dto/borrower.dto";
import { Pagination } from "src/common/dto/pagination";
import { BorrowingProcessDto } from "src/borrowing-processes/dto/borrowing-process.dto";

export class ResponseSingleBorrowerDto {
  @ApiProperty()
  borrower: CreateBorrowerDto;
}

export class ResponseBorrowersDto {
  @ApiProperty({type: 'array', items: {$ref: getSchemaPath(CreateBorrowerDto)}})
  borrowers: CreateBorrowerDto[];

  @ApiProperty()
  pagination: Pagination;
}

export class ResponseBorrowingsDto {
  @ApiProperty({type: 'array', items: {$ref: getSchemaPath(BorrowingProcessDto)}})
  borrowings: BorrowingProcessDto[];
}
