import { Controller, Get, Post, Body, Param, Req, NotFoundException, UseInterceptors, Put, ParseIntPipe, Query, ParseBoolPipe, DefaultValuePipe, Res } from '@nestjs/common';
import { BorrowingProcessesService } from './borrowing-processes.service';
import { CreateBorrowingProcessDto } from './dto/borrowing-process.dto';
import { BorrowersService } from 'src/borrowers/borrowers.service';
import { BooksService } from 'src/books/books.service';
import { ResponseTransform } from 'src/common/interceptors/response.interceptor';
import { Workbook } from 'exceljs';

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
  async findAll(
    @Query(
      'is_overdue_only', 
      new DefaultValuePipe(false), 
      new ParseBoolPipe({optional: true})
    ) isOverdueOnly?: boolean,
  ) {
    const borrowingProcesses = await this.borrowingProcessesService.findAll(isOverdueOnly);
    return {
      borrowingProcesses,
    }
  }

  @Get('/export')
  async export(
    @Query('start_date') startDate: Date,
    @Query('end_date') endDate: Date,
    @Res() res: any,
  ) {
    const borrowingProcesses = await this.borrowingProcessesService.findAll(
      null, 
      null,
      {
        startDate,
        endDate,
      }
    );

    const workbook = new  Workbook()
    const worksheet = workbook.addWorksheet('export-borrowing-with-dates')

    worksheet.columns = [
        { header: 'ID', key: 'id'},
        { header: 'Book Id', key: 'bookId'},
        { header: 'Book Name', key: 'bookName'},
        { header: 'Borrower Name', key: 'borrowerName'},
        { header: 'Borrowing Date', key: 'borrowingDate'},
        { header: 'Return Date', key: 'returnDate'},
    ]

    borrowingProcesses.forEach((val,i,_) => {
        worksheet.addRow(val)
    })

    const buffer = await workbook.xlsx.writeBuffer()

    return res.set('Content-Disposition', `attachment; filename=example.xlsx`).send(buffer)
  }

}
