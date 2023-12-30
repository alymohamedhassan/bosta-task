import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, NotFoundException, HttpCode } from '@nestjs/common';
import { BorrowersService } from './borrowers.service';
import { CreateBorrowerDto, UpdateBorrowerDto } from './dto/borrower.dto';
import { ResponseTransform } from 'src/common/interceptors/response.interceptor';
import { throws } from 'assert';
import { NotEquals } from 'class-validator';

@Controller('borrowers')
export class BorrowersController {
  constructor(private readonly borrowersService: BorrowersService) {}

  @Post()
  @UseInterceptors(ResponseTransform)
  async create(@Body() body: CreateBorrowerDto) {
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
  async findOne(@Param('id') id: string) {
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
  async update(@Param('id') id: string, @Body() body: UpdateBorrowerDto) {
    return this.borrowersService.update(+id, body);
  }

  @Delete(':id')
  @UseInterceptors(ResponseTransform)
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    return this.borrowersService.remove(+id);
  }
}
