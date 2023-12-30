import { Injectable } from '@nestjs/common';
import { CreateBorrowerDto, UpdateBorrowerDto } from './dto/borrower.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BorrowersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(borrower: CreateBorrowerDto) {
    const passwordHash = borrower.password;
    return this.prisma.borrower.create({
      data: {
        name: borrower.name,
        email: borrower.email,
        passwordHash: passwordHash,
      }
    });
  }

  async findAll() {
    return this.prisma.borrower.findMany();
  }

  async findOne(id: number) {
    return this.prisma.borrower.findUnique({
      where: {
        id: +id,
      }
    });
  }

  async update(id: number, updateBorrowerDto: UpdateBorrowerDto) {
    return `This action updates a #${id} borrower`;
  }

  async remove(id: number) {
    return `This action removes a #${id} borrower`;
  }

  async existsById(id: number) {
    const count = await this.prisma.borrower.count({
      where: {
        id: +id,
      }
    })
    return count > 0;
  }
}
