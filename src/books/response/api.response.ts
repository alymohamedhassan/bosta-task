import { ApiProperty } from "@nestjs/swagger";
import { BookDto } from "../dto/book.dto";
import { Pagination } from "src/common/dto/pagination";

export class ResponseSingleBookDto {
  @ApiProperty()
  book: BookDto;
}

export class ResponseBooksDto {
  @ApiProperty()
  books: BookDto;

  @ApiProperty()
  pagination: Pagination
}
