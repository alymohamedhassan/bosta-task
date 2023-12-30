import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, NotFoundException, HttpCode, BadRequestException, ParseIntPipe, Query, DefaultValuePipe, Req, ForbiddenException } from '@nestjs/common';
import { BorrowersService } from './borrowers.service';
import { CreateBorrowerDto, UpdateBorrowerDto } from './dto/borrower.dto';
import { ResponseTransform } from 'src/common/interceptors/response.interceptor';
import { Pagination } from 'src/common/dto/pagination';
import { BorrowingProcessesService } from 'src/borrowing-processes/borrowing-processes.service';

@Controller('borrowers')
export class BorrowersController {
  constructor(
    private readonly borrowersService: BorrowersService,
    private readonly borrowingsService: BorrowingProcessesService,
  ) {}

  @Post()
  @UseInterceptors(ResponseTransform)
  @HttpCode(201)
  async create(@Body() body: CreateBorrowerDto) {
    const exists = await this.borrowersService.existsByEmail(body.email);
    if (exists) 
      throw new BadRequestException("Borrower already exists, duplicate record (email) has to be unique")

    const borrower = await this.borrowersService.create(body);

    return {
      borrower,
    }
  }

  @Get()
  @UseInterceptors(ResponseTransform)
  async findAll(
    @Query('page', new DefaultValuePipe(1) , ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10) , ParseIntPipe) size: number,
  ) {
    const {borrowers, count} = await this.borrowersService.findAll(
      page,
      size
    );
    const pagination = new Pagination(count, {page, size})
    return {
      borrowers,
      pagination,
    }
  }

  @Get(':id')
  @UseInterceptors(ResponseTransform)
  async findOne(@Param('id', ParseIntPipe) id: string) {
    const exists = await this.borrowersService.existsById(+id);
    if (!exists)
      throw new NotFoundException("Borrower not found")

    const borrower = await this.borrowersService.findOne(+id);
    return {
      borrower,
    }
  }

  @Get(':id/borrowings')
  @UseInterceptors(ResponseTransform)
  async findBorrowings(@Param('id', ParseIntPipe) id: string, @Req() request: any) {
    const authBorrower: {id: number, email: string} = request.borrower;
    if (authBorrower.id !== +id)
      throw new ForbiddenException()

    const exists = await this.borrowersService.existsById(+id);
    if (!exists)
      throw new NotFoundException("Borrower not found")

    const borrower = await this.borrowingsService.findAll(false, +id);
    return {
      borrower,
    }
  }

  @Patch(':id')
  @UseInterceptors(ResponseTransform)
  @HttpCode(204)
  async update(@Param('id', ParseIntPipe) id: string, @Body() body: UpdateBorrowerDto) {
    const exists = await this.borrowersService.existsById(+id);
    if (!exists) 
      throw new NotFoundException("Borrower not found")

    return this.borrowersService.update(+id, body);
  }

  @Delete(':id')
  @UseInterceptors(ResponseTransform)
  @HttpCode(204)
  async delete(@Param('id', ParseIntPipe) id: string) {
    const exists = await this.borrowersService.existsById(+id);
    if (!exists) 
      throw new NotFoundException("Borrower not found")

    return this.borrowersService.delete(+id);
  }
}
