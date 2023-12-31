import { Injectable } from '@nestjs/common';
import { CreateBorrowerDto, UpdateBorrowerDto } from './dto/borrower.dto';
import { PrismaService } from '../prisma/prisma.service';
import { BorrowerNotFoundException } from './exceptions/not-found.exception';

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

  async findAll(page: number = 1, size: number = 10, deleted: boolean = false) {
    const deletedCondition = deleted? {NOT: {deletedAt: null}}: {deletedAt: null};
    const borrowers = await this.prisma.borrower.findMany({
      where: {
        ...deletedCondition,
      },
      skip: size * (page-1),
      take: size,
    });
    const count = await this.prisma.borrower.count({
      where: {
        ...deletedCondition,
      }
    })
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
    const borrowerExists = await this.existsById(+id);
    if (!borrowerExists) 
      throw new BorrowerNotFoundException()

    return this.prisma.borrower.update({
      where: {
        id: +id,
      },
      data: {
        deletedAt: new Date()
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
