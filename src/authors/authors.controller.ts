import { BadRequestException, Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { ResponseTransform } from 'src/common/interceptors/response.interceptor';
import { CreateAuthorDto } from './dto/create-author.dto';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
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
  @UseInterceptors(ResponseTransform)
  async findAll() {
    const authors = await this.authorsService.findAll()
    return {
      authors,
    }
  }

  @Get(':id')
  @UseInterceptors(ResponseTransform)
  async findOne(@Param('id') id: number) {
    const author = await this.authorsService.findOne(+id)
    return {
      author,
    }
  }

  @Patch(':id')
  @UseInterceptors(ResponseTransform)
  @HttpCode(204)
  async update(@Param('id') id: number, @Body() author: CreateAuthorDto) {
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
  @UseInterceptors(ResponseTransform)
  @HttpCode(204)
  async delete(@Param('id') id: number) {
    const exists = await this.authorsService.existsById(+id);
    if (!exists)
      throw new NotFoundException("Author Does not exist")
    await this.authorsService.delete(+id)
  }

}
