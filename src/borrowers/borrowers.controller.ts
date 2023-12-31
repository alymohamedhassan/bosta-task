import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, NotFoundException, HttpCode, BadRequestException, ParseIntPipe, Query, DefaultValuePipe, Req, ForbiddenException, ParseBoolPipe } from '@nestjs/common';
import { BorrowersService } from './borrowers.service';
import { CreateBorrowerDto, UpdateBorrowerDto } from './dto/borrower.dto';
import { ResponseTransform } from 'src/common/interceptors/response.interceptor';
import { Pagination } from 'src/common/dto/pagination';
import { BorrowingProcessesService } from 'src/borrowing-processes/borrowing-processes.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseBorrowersDto, ResponseBorrowingsDto, ResponseSingleBorrowerDto } from './response/api.response';
import { BorrowerNotFoundException } from './exceptions/not-found.exception';
import { BorrowerAlreadyExistsException } from './exceptions/borrower-exists.exception';

@ApiTags('Borrowers')
@Controller('borrowers')
export class BorrowersController {
  constructor(
    private readonly borrowersService: BorrowersService,
    private readonly borrowingsService: BorrowingProcessesService,
  ) {}

  @Post()
  @ApiResponse({
    description: 'Create Borrower',
    status: 201,
    type: ResponseSingleBorrowerDto,
  })
  @UseInterceptors(ResponseTransform)
  @HttpCode(201)
  async create(@Body() body: CreateBorrowerDto) {
    const exists = await this.borrowersService.existsByEmail(body.email);
    if (exists) 
      throw new BorrowerAlreadyExistsException()

    const borrower = await this.borrowersService.create(body);

    return {
      borrower,
    }
  }

  @Get()
  @ApiResponse({
    description: 'List All Borrowers',
    status: 200,
    type: ResponseBorrowersDto,
  })
  @UseInterceptors(ResponseTransform)
  async findAll(
    @Query('page', new DefaultValuePipe(1) , ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10) , ParseIntPipe) size: number,
    @Query('deleted', new DefaultValuePipe(false), ParseBoolPipe) deleted: boolean,
  ) {
    const {borrowers, count} = await this.borrowersService.findAll(
      page,
      size,
      deleted,
    );
    const pagination = new Pagination(count, {page, size})
    return {
      borrowers,
      pagination,
    }
  }

  @Get(':id')
  @ApiResponse({
    description: 'List All Borrowers',
    status: 200,
    type: ResponseSingleBorrowerDto,
  })
  @UseInterceptors(ResponseTransform)
  async findOne(@Param('id', ParseIntPipe) id: string) {
    const exists = await this.borrowersService.existsById(+id);
    if (!exists)
      throw new BorrowerNotFoundException()

    const borrower = await this.borrowersService.findOne(+id);
    return {
      borrower,
    }
  }

  @Get(':id/borrowings')
  @ApiResponse({
    description: 'List Borrower\'s borrowings',
    status: 200,
    type: ResponseBorrowingsDto,
  })
  @UseInterceptors(ResponseTransform)
  async findBorrowings(@Param('id', ParseIntPipe) id: string, @Req() request: any) {
    const exists = await this.borrowersService.existsById(+id);
    if (!exists)
      throw new BorrowerNotFoundException()

    const borrower = await this.borrowingsService.findAll(false, +id);
    return {
      borrower,
    }
  }

  @Patch(':id')
  @ApiResponse({
    description: 'Update Borrower',
    status: 204,
  })
  @UseInterceptors(ResponseTransform)
  @HttpCode(204)
  async update(@Param('id', ParseIntPipe) id: string, @Body() body: UpdateBorrowerDto) {
    const exists = await this.borrowersService.existsById(+id);
    if (!exists) 
      throw new BorrowerNotFoundException()

    return this.borrowersService.update(+id, body);
  }

  @Delete(':id')
  @ApiResponse({
    description: 'Delete Borrower by id',
    status: 204,
  })
  @UseInterceptors(ResponseTransform)
  @HttpCode(204)
  async delete(@Param('id', ParseIntPipe) id: string) {
    return this.borrowersService.delete(+id);
  }
}
