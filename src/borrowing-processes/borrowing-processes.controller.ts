import { Controller, Get, Post, Body, Param, Req, NotFoundException, UseInterceptors, Put, ParseIntPipe, Query, ParseBoolPipe, DefaultValuePipe } from '@nestjs/common';
import { BorrowingProcessesService } from './borrowing-processes.service';
import { CreateBorrowingProcessDto } from './dto/borrowing-process.dto';
import { BorrowersService } from 'src/borrowers/borrowers.service';
import { BooksService } from 'src/books/books.service';
import { ResponseTransform } from 'src/common/interceptors/response.interceptor';

@Controller('borrowing-processes')
export class BorrowingProcessesController {
  constructor(
    private readonly borrowersService: BorrowersService,
    private readonly booksService: BooksService,
    private readonly borrowingProcessesService: BorrowingProcessesService
  ) {}

  @Post()
  @UseInterceptors(ResponseTransform)
  async checkout(@Body() body: CreateBorrowingProcessDto, @Req() request: any) {
    const borrower: {id: number, email: string} = request.borrower;

    const borrowerExists = await this.borrowersService.existsById(borrower.id);
    if (!borrowerExists)
      throw new NotFoundException("Borrower not found")

    const bookExists = await this.booksService.existsById(body.bookId);
    if (!bookExists)
      throw new NotFoundException("Book not found")

    const process = await this.borrowingProcessesService.checkout(body, borrower.id);
    return {
      process,
    }
  }

  @Put(':id/return')
  @UseInterceptors(ResponseTransform)
  async return(@Param('id', ParseIntPipe) id: number) {
    const exists = await this.borrowingProcessesService.exists(+id);
    if (!exists)
      throw new NotFoundException("Borrowing Process not found.")

    return this.borrowingProcessesService.return(+id)
  }

  @Get()
  @UseInterceptors(ResponseTransform)
  findAll(@Query('is_overdue', new DefaultValuePipe(false), new ParseBoolPipe({optional: true})) isOverdue?: boolean) {
    return this.borrowingProcessesService.findAll(isOverdue);
  }

}
