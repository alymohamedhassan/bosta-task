import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBorrowingProcessDto } from './dto/borrowing-process.dto';
import { BooksService } from '../books/books.service';
import { BorrowersService } from '../borrowers/borrowers.service';
import { BookNotFoundException } from '../books/exceptions/not-found.exception';
import { BorrowerNotFoundException } from '../borrowers/exceptions/not-found.exception';
import { NotAvailableException } from './exceptions/not-available.exception';
import { InvalidReturnDateException } from './exceptions/invalid-returndate.exception';
import { BorrowerAlreadyBorrowedBookException } from './exceptions/borrower-has-book.exception';

@Injectable()
export class BorrowingProcessesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly booksService: BooksService,
    private readonly borrowersService: BorrowersService,
  ) {}

  async isBorrowerHasBook(bookId: number, borrowerId: number) {
    const count = await this.prisma.borrowing.count({
      where: {
        bookId,
        borrowerId,
        isReturned: false,
      }
    })
    return count > 0;
  }

  async checkout(process: CreateBorrowingProcessDto, borrowerId: number) {
    const borrowerHasBook = await this.isBorrowerHasBook(process.bookId, borrowerId);
    if (borrowerHasBook)
      throw new BorrowerAlreadyBorrowedBookException()

    if (new Date(process.returnDate) <= new Date())
      throw new InvalidReturnDateException()

    const borrowerExists = await this.borrowersService.existsById(borrowerId);
    if (!borrowerExists)
      throw new BorrowerNotFoundException()

    const bookExists = await this.booksService.existsById(process.bookId);
    if (!bookExists)
      throw new BookNotFoundException()

    const isAvailable = await this.isBookAvailebleToBorrow(process.bookId);
    if (!isAvailable)
      throw new NotAvailableException()

    return this.prisma.borrowing.create({
      include: {
        book: true,
        borrower: true,
      },
      data: {
        bookId: process.bookId,
        borrowerId: borrowerId,
        borrowingDate: new Date(),
        returnDate: new Date(process.returnDate),
      }
    });
  }

  async findAll(
    isOverdueOnly: boolean,
    borrowerId?: number,
    dates?: {startDate?: Date, endDate?: Date},
  ) {
    const isOverdueCondition = {
      isReturned: false,
      returnDate: {
        lt: new Date(),
      }
    }

    let where = {};

    if (isOverdueOnly) where = {...isOverdueCondition}
    if (borrowerId) where = {...where, borrowerId,}

    if (dates?.startDate && dates?.endDate) 
      where = {
        ...where, 
        borrowingDate: {
          gte: new Date(dates?.startDate),
          lte: new Date(dates?.endDate),
        }
      }

    const borrowings = await this.prisma.borrowing.findMany({
      include: {
        book: true,
        borrower: true,
      },
      where,
      orderBy: {
        id: 'asc',
      }
    });
    return borrowings;
  }

  async exists(id: number) {
    const count = await this.prisma.borrowing.count({
      where: {
        id: +id,
      }
    })
    return count > 0;
  }

  async return(id: number) {
    return this.prisma.borrowing.update({
      where: {
        id: +id,
      },
      data: {
        isReturned: true,
      }
    });
  }

  async countBook(bookId: number, isReturned: boolean = false): Promise<number> {
    const countBook = await this.prisma.borrowing.count({
      where: {
        bookId,
        isReturned,
      }
    });
    return countBook;
  }

  async isBookAvailebleToBorrow(bookId: number) {
    const book = await this.booksService.findOne(+bookId);
    const quantity = book.totalQuantity;
    const borrowingsCount = await this.countBook(+bookId)
    const available = quantity - borrowingsCount;
    return available > 0;
  }
}
