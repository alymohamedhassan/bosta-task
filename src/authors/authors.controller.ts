import { BadRequestException, Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, ParseIntPipe, Patch, Post, UseInterceptors } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { ResponseTransform } from 'src/common/interceptors/response.interceptor';
import { CreateAuthorDto } from './dto/create-author.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseAuthorsDto, ResponseSingleAuthorDto } from './response/api.response';

@ApiTags('Authors')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  @ApiResponse({
    description: 'Create Author',
    status: 201,
    type: ResponseSingleAuthorDto,
  })
  @UseInterceptors(ResponseTransform)
  @HttpCode(201)
  async create(@Body() author: CreateAuthorDto) {
    const exists = await this.authorsService.existsByName(author.name);
    if (exists) 
      throw new NotFoundException("Author Name already exists")

    return {
      book: await this.authorsService.create(author),
    }
  }

  @Get()
  @ApiResponse({
    description: 'List Authors',
    status: 200,
    type: ResponseAuthorsDto,
  })
  @UseInterceptors(ResponseTransform)
  async findAll() {
    const authors = await this.authorsService.findAll()
    return {
      authors,
    }
  }

  @Get(':id')
  @ApiResponse({
    description: 'Get Single Author by id',
    status: 200,
    type: ResponseSingleAuthorDto,
  })
  @UseInterceptors(ResponseTransform)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const author = await this.authorsService.findOne(+id)
    if (!author)
      throw new NotFoundException("Author Does not exist")

    return {
      author,
    }
  }

  @Patch(':id')
  @ApiResponse({
    description: 'Update Author',
    status: 204,
  })
  @UseInterceptors(ResponseTransform)
  @HttpCode(204)
  async update(@Param('id', ParseIntPipe) id: number, @Body() author: CreateAuthorDto) {
    const idExists = await this.authorsService.existsById(+id);
    if (!idExists)
      throw new NotFoundException("Author Id does not exist!");

    const nameExists = await this.authorsService.existsByName(author.name, +id);
    if (nameExists) 
      throw new BadRequestException("Author name already exists")

    const updatedAuthor = await this.authorsService.update(+id, author)
    return {
      author: updatedAuthor,
    }
  }

  @Delete(':id')
  @ApiResponse({
    description: 'Delete Author',
    status: 204,
  })
  @UseInterceptors(ResponseTransform)
  @HttpCode(204)
  async delete(@Param('id', ParseIntPipe) id: number) {
    const exists = await this.authorsService.existsById(+id);
    if (!exists)
      throw new NotFoundException("Author Does not exist")

    await this.authorsService.delete(+id)
  }

}
