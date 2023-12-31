import { NotFoundException } from "@nestjs/common";

export class BorrowerNotFoundException extends NotFoundException {
  constructor() {
    super(
      "Borrower not found", 
    );
  }
}
