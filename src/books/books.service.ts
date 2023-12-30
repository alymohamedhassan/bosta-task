import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  create(book: CreateBookDto) {
    return 'This action adds a new book';
  }

  async findAll() {
    const books = await this.prisma.book.findMany();
    return {
      books,
    };
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: {
        id,
      }
    })

    // TODO: add exception if book not found
    return {
      book,
    };
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
