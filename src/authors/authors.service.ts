import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(author: CreateAuthorDto) {
    const exists = await this.existsByName(author.name);

    if (exists) throw new NotFoundException("Author Name already exists")

    return this.prisma.author.create({
      data: {
        name: author.name,
      }
    });
  }

  async findAll() {
    return this.prisma.author.findMany()
  }

  async findOne(id: number) {
    return this.prisma.author.findUnique({
      where: {
        id: +id,
      }
    })
  }

  async update(id: number, author: CreateAuthorDto) {
    const exists = await this.existsByName(author.name, +id);
    if (exists) throw new NotFoundException("Author name already exists")

    return this.prisma.author.update({
      where: {
        id: +id,
      },
      data: {
        name: author.name,
      }
    })
  }

  async delete(id: number) {
    await this.prisma.author.delete({
      where: {
        id: +id,
      }
    })
  }

  async existsById(id: number) {
    const count = await this.prisma.author.count({
      where: {
        id: +id,
      }
    });
    return count > 0;
  }

  async existsByName(name: string, exceptId?: number) {
    const count = await this.prisma.author.count({
      where: {
        name,
        id: {
          not: {
            equals: +exceptId,
          }
        }
      }
    });
    return count > 0;
  }
}
