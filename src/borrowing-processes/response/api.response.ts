import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { BorrowingProcessDto } from "../dto/borrowing-process.dto";

export class ResponseSingleBorrowingProcessDto {
  @ApiProperty()
  borrowingProcess: BorrowingProcessDto;
}

export class ResponseBorrowingProcessesDto {
  @ApiProperty({type: 'array', items: {$ref: getSchemaPath(BorrowingProcessDto)}})
  borrowingProcesses: BorrowingProcessDto[];
}

