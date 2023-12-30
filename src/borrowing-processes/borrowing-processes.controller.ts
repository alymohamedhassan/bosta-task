import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseInterceptors, Put, ParseIntPipe, Query, ParseBoolPipe, DefaultValuePipe } from '@nestjs/common';
import { BorrowingProcessesService } from './borrowing-processes.service';
import { CreateBorrowingProcessDto, UpdateBorrowingProcessDto } from './dto/borrowing-process.dto';
import { BorrowersService } from 'src/borrowers/borrowers.service';
import { BooksService } from 'src/books/books.service';
import { type, userInfo } from 'os';
import { ResponseTransform } from 'src/common/interceptors/response.interceptor';
import e from 'express';
import { throws } from 'assert';
import { NotFoundError } from 'rxjs';
import { isInstance } from 'class-validator';

@Controller('borrowing-processes')
export class BorrowingProcessesController {
  constructor(
    private readonly borrowersService: BorrowersService,
    private readonly booksService: BooksService,
    private readonly borrowingProcessesService: BorrowingProcessesService
  ) {}

  @Post()
  @UseInterceptors(ResponseTransform)
  async checkout(@Body() body: CreateBorrowingProcessDto) {
    const borrowerExists = await this.borrowersService.existsById(body.borrowerId);
    if (!borrowerExists)
      throw new NotFoundException("Borrower not found")

    const bookExists = await this.booksService.existsById(body.bookId);
    if (!bookExists)
      throw new NotFoundException("Book not found")

    const process = await this.borrowingProcessesService.checkout(body);
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
