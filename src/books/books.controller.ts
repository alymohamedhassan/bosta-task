import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, NotFoundException, BadRequestException, HttpCode, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { BooksService } from './books.service';
import { BookDto, CreateBookDto, UpdateBookDto } from './dto/book.dto';
import { ResponseTransform } from 'src/common/interceptors/response.interceptor';
import { AuthorsService } from 'src/authors/authors.service';
import { Pagination } from 'src/common/dto/pagination';
import { ApiOkResponse, ApiProperty, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/dto/response.dto';
import { ResponseBooksDto, ResponseSingleBookDto } from './response/api.response';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService, 
    private readonly authorService: AuthorsService,
  ) {}

  @Post()
  @ApiOkResponse({
    description: 'Create new book',
    status: 201,
    type: ResponseSingleBookDto,
  })
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
  @ApiOkResponse({
    description: 'List books',
    status: 200,
    type: ResponseBooksDto,
  })
  @UseInterceptors(ResponseTransform)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
    @Query('search') search: string, 
  ) {
    const {books, count} = await this.booksService.findAll(
      page,
      size,
      search
    );

    const pagination = new Pagination(count, {page, size,});
    
    return {
      books,
      pagination,
    }
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Get Single Book by id',
    status: 200,
    type: ResponseSingleBookDto,
  })
  @UseInterceptors(ResponseTransform)
  async findOne(@Param('id') id: string) {
    const book = await this.booksService.findOne(+id);
    return {
      book,
    }
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Update Book',
    status: 204,
  })
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
  @ApiOkResponse({
    description: 'Delete Book by id',
    status: 204,
  })
  @HttpCode(204)
  @UseInterceptors(ResponseTransform)
  async remove(@Param('id') id: string) {
    const exists = await this.booksService.existsById(+id)
    if (!exists)
      throw new NotFoundException("Book not found")

    return this.booksService.delete(+id);
  }
}
