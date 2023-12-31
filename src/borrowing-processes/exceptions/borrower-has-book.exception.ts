import { BadRequestException } from "@nestjs/common";

export class BorrowerAlreadyBorrowedBookException extends BadRequestException {
  constructor() {
    super("Borrower already borrowed book")
  }
}
