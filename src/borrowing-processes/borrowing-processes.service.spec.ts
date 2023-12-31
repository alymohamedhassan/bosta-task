import { Test, TestingModule } from '@nestjs/testing';
import { BorrowingProcessesService } from './borrowing-processes.service';
import { PrismaService } from '../prisma/prisma.service';
import { BooksService } from '../books/books.service';
import { BorrowersService } from '../borrowers/borrowers.service';
import { BookNotFoundException } from '../books/exceptions/not-found.exception';
import { BorrowerNotFoundException } from '../borrowers/exceptions/not-found.exception';
import { NotAvailableException } from './exceptions/not-available.exception';
import { InvalidReturnDateException } from './exceptions/invalid-returndate.exception';

describe('BorrowingProcessesService', () => {
  let service: BorrowingProcessesService;
  let booksService: BooksService;
  let borrowersService: BorrowersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BorrowingProcessesService, PrismaService, BorrowersService, BooksService],
    }).compile();

    service = module.get<BorrowingProcessesService>(BorrowingProcessesService);
    booksService = module.get<BooksService>(BooksService);
    borrowersService = module.get<BorrowersService>(BorrowersService);
    prisma = module.get<PrismaService>(PrismaService);
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Checkout - borrower not found', async () => {
    const expectedReturnDate = new Date().setDate(new Date().getDate() + 2);
    const {books} = await booksService.findAll(1, 1);
    const bookId = books[0].id

    try {
      await service.checkout(
        {
          bookId: bookId, 
          returnDate: new Date(expectedReturnDate),
        }, 
        99999
      )
    } catch (error) {
      expect(error).toBeInstanceOf(BorrowerNotFoundException)
    }
  });

  it('Checkout - book not found', async () => {
    const expectedReturnDate = new Date().setDate(new Date().getDate() + 2);
    const {borrowers} = await borrowersService.findAll(1, 1);

    try {
      await service.checkout(
        {
          bookId: 9999,
          returnDate: new Date(expectedReturnDate),
        }, 
        borrowers[0].id,
      )
    } catch (error) {
      expect(error).toBeInstanceOf(BookNotFoundException)
    }
  });
  
  it('Checkout - book not available to checkout', async () => {
    const expectedReturnDate = new Date().setDate(new Date().getDate() + 2);
    const {borrowers} = await borrowersService.findAll(1, 1);

    const author = await prisma.author.create({
      data: {name: 'Author' + String(new Date().getMilliseconds())}
    });
    const authorId = author.id;

    const book = await booksService.create({
      title: 'Demo test not available to checkout' + String(new Date().getMilliseconds()),
      authorId,
      isbn: String(new Date().getMilliseconds()),
      shelfLocation: 'LKI-098',
      totalQuantity: 0,
    });

    try {
      await service.checkout(
        {
          bookId: book.id, 
          returnDate: new Date(expectedReturnDate),
        }, 
        borrowers[0].id,
      )
      throw new Error("Available to checkout")
    } catch (error) {
      expect(error).toBeInstanceOf(NotAvailableException)
    }
  });
  
  it('Checkout - invalid return date less than today', async () => {
    const expectedReturnDate = new Date().setDate(new Date().getDate() - 2);
    const {borrowers} = await borrowersService.findAll(1, 1);

    const author = await prisma.author.create({
      data: {name: 'Author' + String(new Date().getMilliseconds())}
    });
    const authorId = author.id;

    const book = await booksService.create({
      title: 'Demo test available to checkout' + String(new Date().getMilliseconds()),
      authorId,
      isbn: String(new Date().getMilliseconds()),
      shelfLocation: 'LKI-098',
      totalQuantity: 1,
    });

    try {
      await service.checkout(
        {
          bookId: book.id, 
          returnDate: new Date(expectedReturnDate),
        }, 
        borrowers[0].id,
      )
      throw new Error("Available to checkout")
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidReturnDateException)
    }
  });
  
  it('Checkout - book available to checkout', async () => {
    const expectedReturnDate = new Date().setDate(new Date().getDate() + 2);
    const {borrowers} = await borrowersService.findAll(1, 1);

    const author = await prisma.author.create({
      data: {name: 'Author' + String(new Date().getMilliseconds())}
    });

    const authorId = author.id;
    const title = 'Demo test available to checkout' + String(new Date().getMilliseconds());
    const isbn = String(new Date().getMilliseconds());
    const shelfLocation = 'LKI-098';
    const totalQuantity = 1

    const book = await booksService.create({
      title: 'Demo test available to checkout' + String(new Date().getMilliseconds()),
      authorId,
      isbn: String(new Date().getMilliseconds()),
      shelfLocation: 'LKI-098',
      totalQuantity: 1,
    });

    const result = {
      book: {
        authorId,
        isbn,
        shelfLocation,
        title,
        totalQuantity,
      }
    }

    try {
      const borrowing = await service.checkout(
        {
          bookId: book.id, 
          returnDate: new Date(expectedReturnDate),
        }, 
        borrowers[0].id,
      );
      expect(borrowing).toMatchObject(result)
    } catch (error) {
      throw new Error("Checkout mismatch")
    }
  });
});
