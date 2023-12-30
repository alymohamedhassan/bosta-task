import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ResponseTransform } from 'src/common/interceptors/response.interceptor';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UseInterceptors(ResponseTransform)
  create(@Body() book: CreateBookDto) {
    return this.booksService.create(book);
  }

  @Get()
  @UseInterceptors(ResponseTransform)
  findAll() {
    return this.booksService.findAll();
  }

  @Get(':id')
  @UseInterceptors(ResponseTransform)
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(ResponseTransform)
  update(@Param('id') id: string, @Body() book: UpdateBookDto) {
    return this.booksService.update(+id, book);
  }

  @Delete(':id')
  @UseInterceptors(ResponseTransform)
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }
}
