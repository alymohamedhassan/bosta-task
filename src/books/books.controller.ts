import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, NotFoundException, BadRequestException, HttpCode } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto';
import { ResponseTransform } from 'src/common/interceptors/response.interceptor';
import { AuthorsService } from 'src/authors/authors.service';

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService, 
    private readonly authorService: AuthorsService,
  ) {}

  @Post()
  @UseInterceptors(ResponseTransform)
  @HttpCode(201)
  async create(@Body() book: CreateBookDto) {
    const authorIdExists = await this.authorService.existsById(book.authorId);
    if (!authorIdExists)
      throw new NotFoundException("Author not found")

    const bookTitleExists = await this.booksService.exists(book);
    if (bookTitleExists)
      throw new BadRequestException("Book already exists, duplicate record (isbn and title) has to be unqiue")

    return this.booksService.create(book);
  }

  @Get()
  @UseInterceptors(ResponseTransform)
  async findAll() {
    const books = await this.booksService.findAll();
    return {
      books,
    }
  }

  @Get(':id')
  @UseInterceptors(ResponseTransform)
  async findOne(@Param('id') id: string) {
    const book = await this.booksService.findOne(+id);
    return {
      book,
    }
  }

  @Patch(':id')
  @UseInterceptors(ResponseTransform)
  @HttpCode(204)
  async update(@Param('id') id: string, @Body() book: UpdateBookDto) {
    const exists = await this.booksService.existsById(+id)
    if (!exists)
      throw new NotFoundException("Book not found")

    if (book?.authorId) {
      const authorIdExists = await this.authorService.existsById(book?.authorId)
      if (!authorIdExists)
        throw new NotFoundException("Author not found")
    }

    return this.booksService.update(+id, book);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseInterceptors(ResponseTransform)
  async remove(@Param('id') id: string) {
    const exists = await this.booksService.existsById(+id)
    if (!exists)
      throw new NotFoundException("Book not found")

    return this.booksService.delete(+id);
  }
}
