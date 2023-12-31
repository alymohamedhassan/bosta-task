import { BadRequestException } from "@nestjs/common";

export class InvalidReturnDateException extends BadRequestException {
  constructor() {
    super("Invalid Return Date, return date has to be greater than today")
  }
}
