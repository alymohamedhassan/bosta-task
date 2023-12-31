import { BadRequestException } from "@nestjs/common";

export class NotAvailableException extends BadRequestException {
  constructor() {
    super("Book not available to borrow")
  }
}
