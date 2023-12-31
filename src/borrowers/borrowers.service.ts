import { Injectable } from '@nestjs/common';
import { CreateBorrowerDto, UpdateBorrowerDto } from './dto/borrower.dto';
import { PrismaService } from '../prisma/prisma.service';

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

  async findAll(page: number = 1, size: number = 10) {
    const borrowers = await this.prisma.borrower.findMany({
      skip: size * (page-1),
      take: size,
    });
    const count = await this.prisma.borrower.count()
    return {borrowers, count}
  }

  async findOne(id: number) {
    return this.prisma.borrower.findUnique({
      where: {
        id: +id,
      }
    });
  }

  async update(id: number, borrower: UpdateBorrowerDto) {
    return this.prisma.borrower.update({
      where: {
        id: +id,
      },
      data: {
        name: borrower?.name,
        email: borrower?.email
      }
    });
  }

  async delete(id: number) {
    return this.prisma.borrower.delete({
      where: {
        id: +id,
      }
    });
  }

  async existsById(id: number) {
    const count = await this.prisma.borrower.count({
      where: {
        id: +id,
      }
    })
    return count > 0;
  }

  async existsByEmail(email: string) {
    const count = await this.prisma.borrower.count({
      where: {
        email: email,
      }
    });
    return count > 0;
  }
}
