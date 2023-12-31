import { Controller, Get, Post, Body, Param, Req, NotFoundException, UseInterceptors, Put, ParseIntPipe, Query, ParseBoolPipe, DefaultValuePipe, Res, HttpCode } from '@nestjs/common';
import { Workbook } from 'exceljs';
import { ApiProduces, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BorrowingProcessesService } from './borrowing-processes.service';
import { CreateBorrowingProcessDto } from './dto/borrowing-process.dto';
import { BorrowersService } from 'src/borrowers/borrowers.service';
import { BooksService } from 'src/books/books.service';
import { ResponseTransform } from 'src/common/interceptors/response.interceptor';
import { ResponseBorrowingProcessesDto, ResponseExportExcelDto, ResponseSingleBorrowingProcessDto } from './response/api.response';

@ApiTags('Borrowing Processes')
@Controller('borrowing-processes')
export class BorrowingProcessesController {
  constructor(
    private readonly borrowersService: BorrowersService,
    private readonly booksService: BooksService,
    private readonly borrowingProcessesService: BorrowingProcessesService
  ) {}

  @Post()
  @ApiResponse({
    description: 'Create a Borrowing Process',
    status: 201,
    type: ResponseSingleBorrowingProcessDto,
  })
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
  @ApiResponse({
    description: 'Return a Book',
    status: 204,
  })
  @HttpCode(204)
  @UseInterceptors(ResponseTransform)
  async return(@Param('id', ParseIntPipe) id: number) {
    const exists = await this.borrowingProcessesService.exists(+id);
    if (!exists)
      throw new NotFoundException("Borrowing Process not found.")

    return this.borrowingProcessesService.return(+id)
  }

  @Get()
  @ApiResponse({
    description: 'List all Borrowing Process',
    status: 200,
    type: ResponseBorrowingProcessesDto,
  })
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
  @ApiProduces('application/xlsx')
  @ApiQuery({
    name: 'report',
    required: true,
    enum: [
      'all',
      'timeframe',
      'is_overdue_only',
    ]
  })
  @ApiQuery({
    name: 'start_date',
    required: false,
  })
  @ApiQuery({
    name: 'end_date',
    required: false,
  })
  @ApiResponse({
    description: 'Export to excelsheet',
    status: 200,
  })
  async export(
    @Query('report', new DefaultValuePipe('timeframe')) report: string,
    @Query('start_date') startDate: Date,
    @Query('end_date') endDate: Date,
    @Res() res: any,
  ) {
    let timeframe = {}
    if (report === "timeframe") {
      timeframe = {
        startDate,
        endDate,
      }
    }

    if (report !== "timeframe") {
      const now = new Date();
      const lastMonth = new Date(new Date().setDate(now.getDate() - 30))
      timeframe = {
        startDate: lastMonth,
        endDate: now,
      }
    }

    const borrowingProcesses = await this.borrowingProcessesService.findAll(
      report === "is_overdue_only"? true: undefined, 
      null,
      timeframe, 
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
