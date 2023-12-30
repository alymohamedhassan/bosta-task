import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBorrowingProcessDto, UpdateBorrowingProcessDto } from './dto/borrowing-process.dto';
import { trace } from 'console';

@Injectable()
export class BorrowingProcessesService {
  constructor(private readonly prisma: PrismaService) {}

  async checkout(process: CreateBorrowingProcessDto, borrowerId: number) {
    if (new Date(process.returnDate) <= new Date())
      throw new BadRequestException("Return Date has to be greater than today")

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
    return borrowings.map((borrowing) => {
      return {
        id: borrowing.id,
        bookId: borrowing.bookId,
        bookName: borrowing.book.title,
        borrowerId: borrowing.borrowerId,
        borrowerName: borrowing.borrower.name,
        returnDate: borrowing.returnDate,
        borrowingDate: borrowing.borrowingDate,
        isReturned: borrowing.isReturned,
      }
    })
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

  remove(id: number) {
    return `This action removes a #${id} borrowingProcess`;
  }
}
