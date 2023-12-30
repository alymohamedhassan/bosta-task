import { Module } from '@nestjs/common';
import { BorrowersService } from './borrowers.service';
import { BorrowersController } from './borrowers.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { BorrowingProcessesService } from 'src/borrowing-processes/borrowing-processes.service';

@Module({
  controllers: [BorrowersController],
  providers: [BorrowersService, PrismaService, BorrowingProcessesService],
})
export class BorrowersModule {}
