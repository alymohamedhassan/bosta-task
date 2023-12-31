import { Controller, Get, Post, Body, Param, Req, NotFoundException, UseInterceptors, Put, ParseIntPipe, Query, ParseBoolPipe, DefaultValuePipe, Res, HttpCode } from '@nestjs/common';
import { Workbook } from 'exceljs';
import { ApiProduces, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BorrowingProcessesService } from './borrowing-processes.service';
import { CreateBorrowingProcessDto } from './dto/borrowing-process.dto';
import { ResponseTransform } from 'src/common/interceptors/response.interceptor';
import { ResponseBorrowingProcessesDto, ResponseSingleBorrowingProcessDto } from './response/api.response';

@ApiTags('Borrowing Processes')
@Controller('borrowing-processes')
export class BorrowingProcessesController {
  constructor(
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
  @ApiProduces('application/vnd.ms-excel')
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
    const borrowingProcessesRemap = borrowingProcesses.map((borrowing) => {
      return {
        id: borrowing.id,
        bookId: borrowing.bookId,
        bookName: borrowing.book.title,
        borrowerId: borrowing.borrowerId,
        borrowerName: borrowing.borrower.name,
        returnDate: borrowing.returnDate,
        borrowingDate: borrowing.borrowingDate,
        isReturned: borrowing.isReturned,
      }
    })

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

    borrowingProcessesRemap.forEach((val,i,_) => {
        worksheet.addRow(val)
    })

    const buffer = await workbook.xlsx.writeBuffer()

    return res
      .set('Content-Disposition', `attachment; filename=Export.xlsx`)
      .set('Contet-Type', 'application/vnd.ms-excel')
      .send(buffer)
  }

}
