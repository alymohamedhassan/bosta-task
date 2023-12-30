import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, NotFoundException, HttpCode, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { BorrowersService } from './borrowers.service';
import { CreateBorrowerDto, UpdateBorrowerDto } from './dto/borrower.dto';
import { ResponseTransform } from 'src/common/interceptors/response.interceptor';

@Controller('borrowers')
export class BorrowersController {
  constructor(private readonly borrowersService: BorrowersService) {}

  @Post()
  @UseInterceptors(ResponseTransform)
  @HttpCode(201)
  async create(@Body() body: CreateBorrowerDto) {
    const exists = await this.borrowersService.existsByEmail(body.email);
    console.log("existsByEmail:", exists)
    if (exists) 
      throw new BadRequestException("Borrower already exists, duplicate record (email) has to be unique")

    const borrower = await this.borrowersService.create(body);

    return {
      borrower,
    }
  }

  @Get()
  @UseInterceptors(ResponseTransform)
  async findAll() {
    const borrowers = await this.borrowersService.findAll();
    return {
      borrowers,
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
