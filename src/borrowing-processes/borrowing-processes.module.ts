import { Module } from '@nestjs/common';
import { BorrowingProcessesService } from './borrowing-processes.service';
import { BorrowingProcessesController } from './borrowing-processes.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { BorrowersService } from 'src/borrowers/borrowers.service';
import { BooksService } from 'src/books/books.service';

@Module({
  controllers: [BorrowingProcessesController],
  providers: [BorrowingProcessesService, PrismaService, BorrowersService, BooksService],
})
export class BorrowingProcessesModule {}
