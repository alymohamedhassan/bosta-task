import { Body, Controller, Delete, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { ResponseTransform } from 'src/common/interceptors/response.interceptor';
import { CreateAuthorDto } from './dto/create-author.dto';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  @UseInterceptors(ResponseTransform)
  async create(@Body() author: CreateAuthorDto) {
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
  async update(@Param('id') id: number, @Body() author: CreateAuthorDto) {
    const updatedAuthor = await this.authorsService.update(+id, author)
    return {
      author: updatedAuthor,
    }
  }

  @Delete(':id')
  @UseInterceptors(ResponseTransform)
  async delete(@Param('id') id: number) {
    await this.authorsService.delete(+id)
  }

}
