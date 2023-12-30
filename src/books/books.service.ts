import { Injectable } from '@nestjs/common';
import { CreateBookDto, UpdateBookDto } from './dto/create-book.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(book: CreateBookDto) {
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
    return this.prisma.book.findMany();
  }

  async findOne(id: number) {
    return this.prisma.book.findUnique({
      where: {
        id,
      }
    })
  }

  async update(id: number, book: UpdateBookDto) {
    const updatedBook = await this.prisma.book.update({
      where: {
        id: +id,
      },
      data: {
        title: book?.title,
        isbn: book?.isbn,
        authorId: book?.authorId,
        shelfLocation: book?.shelfLocation,
        totalQuantity: book?.totalQuantity,
      }
    })
    return updatedBook;
  }

  async delete(id: number) {
    return this.prisma.book.delete({
      where: {
        id: +id,
      },
    });
  }

  async existsById(id: number) {
    const count = await this.prisma.book.count({
      where: {
        id: +id,
      }
    })
    return count > 0;
  }

  async existsByTitle(title: string) {
    const count = await this.prisma.book.count({
      where: {
        title,
      }
    })
    return count > 0;
  }

  async exists(book: CreateBookDto) {
    const count = await this.prisma.book.count({
      where: {
        OR: [
          {
            title: book.title,
          },
          {
            isbn: book.isbn,
          },
        ]
      }
    })
    return count > 0;
  }
}
