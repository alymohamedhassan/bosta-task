import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(book: CreateBookDto) {
    // TODO: Check if author id exists
    const createdBook = await this.prisma.book.create({
      data: {
        title: book.title,
        isbn: book.isbn,
        totalQuantity: book.totalQuantity,
        shelfLocation: book.shelfLocation,
        authorId: book.authorId,
      }
    });
    return createdBook;
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
