import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthorsService } from 'src/authors/authors.service';

@Module({
  controllers: [BooksController],
  providers: [BooksService, AuthorsService, PrismaService],
})
export class BooksModule {}
