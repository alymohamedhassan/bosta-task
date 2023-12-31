import { Injectable } from '@nestjs/common';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto';
import { PrismaService } from '../prisma/prisma.service';
import { BookNotFoundException } from './exceptions/not-found.exception';

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

  async findAll(
    page: number = 1,
    size: number = 10,
    search?: string,
  ) {
    const where = {
      OR: search ? [
        {
          title: {
            startsWith: search,
          },
        },
        {
          isbn: search,
        },
        {
          author: {
            name: search,
          }
        },
      ]: undefined
    };

    const books = await this.prisma.book.findMany({
      select: {
        id: true,
        title: true,
        isbn: true,
        author: true,
        shelfLocation: true,
        createdAt: true,
      },
      where,
      skip: size * (page-1),
      take: size,
    });

    const count = await this.prisma.book.count({
      where,
    })

    return {
      books,
      count,
    }
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: {
        id,
      }
    });

    if (!book) throw new BookNotFoundException()

    const borrowedBooks = await this.prisma.borrowing.count({
      where: {
        bookId: id,
        isReturned: false,
      }
    });
    const availableQuantity = book?.totalQuantity? book.totalQuantity - borrowedBooks: 0;

    return {
      ...book,
      availableQuantity,
    }
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
