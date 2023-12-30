import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBorrowingProcessDto, UpdateBorrowingProcessDto } from './dto/borrowing-process.dto';

@Injectable()
export class BorrowingProcessesService {
  constructor(private readonly prisma: PrismaService) {}

  async checkout(process: CreateBorrowingProcessDto) {
    if (new Date(process.returnDate) <= new Date())
      throw new BadRequestException("Return Date has to be greater than today")

    return this.prisma.borrowing.create({
      include: {
        book: true,
        borrower: true,
      },
      data: {
        bookId: process.bookId,
        borrowerId: process.borrowerId,
        borrowingDate: new Date(),
        returnDate: new Date(process.returnDate),
      }
    });
  }

  findAll(isOverdueOnly: boolean) {
    const isOverdueCondition = {
      isReturned: false,
      returnDate: {
        lt: new Date(),
      }
    }

    return this.prisma.borrowing.findMany({
      where: isOverdueOnly? isOverdueCondition: undefined,
    });
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
