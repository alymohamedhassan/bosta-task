import { BadRequestException } from "@nestjs/common";

export class BorrowerAlreadyExistsException extends BadRequestException {
  constructor() {
    super("Borrower already exists, duplicate record (email) has to be unique")
  }
}
