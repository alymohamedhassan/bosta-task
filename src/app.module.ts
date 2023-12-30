import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { BorrowersModule } from './borrowers/borrowers.module';
import { CommonModule } from './common/common.module';
import { AuthorsModule } from './authors/authors.module';
import { BorrowingProcessesModule } from './borrowing-processes/borrowing-processes.module';

@Module({
  imports: [BooksModule, BorrowersModule, CommonModule, AuthorsModule, BorrowingProcessesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
