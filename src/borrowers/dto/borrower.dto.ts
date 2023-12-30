import { PartialType } from '@nestjs/mapped-types';

export class CreateBorrowerDto {
  name: string;
  email: string;
  password: string;
}

export class UpdateBorrowerDto extends PartialType(CreateBorrowerDto) {}
