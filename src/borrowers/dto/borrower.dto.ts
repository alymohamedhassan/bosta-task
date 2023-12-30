import { PartialType } from '@nestjs/mapped-types';

export class CreateBorrowerDto {
  name: string;
}

export class UpdateBorrowerDto extends PartialType(CreateBorrowerDto) {}
