import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { BorrowersService } from './borrowers.service';
import { CreateBorrowerDto, UpdateBorrowerDto } from './dto/borrower.dto';
import { ResponseTransform } from 'src/common/interceptors/response.interceptor';

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
    return this.borrowersService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(ResponseTransform)
  async update(@Param('id') id: string, @Body() borrower: UpdateBorrowerDto) {
    return this.borrowersService.update(+id, borrower);
  }

  @Delete(':id')
  @UseInterceptors(ResponseTransform)
  async delete(@Param('id') id: string) {
    return this.borrowersService.remove(+id);
  }
}
