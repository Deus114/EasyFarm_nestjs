import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import aqp from 'api-query-params';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreatePostDto) {
    return await this.prisma.post.create({ data });
  }

  async findAll(qs: string) {
    const { filter, sort } = aqp(qs);

    // Xử lý sort
    const orderBy = {};
    for (const key in sort) {
      orderBy[key] = sort[key] === -1 ? 'desc' : 'asc';
    }

    const where: any = {};

    // Tìm kiếm tương đối cho từng field
    for (const key in filter) {
      where[key] = {
        contains: filter[key],
        mode: 'insensitive',
      };
    }

    return await this.prisma.post.findMany({
      where,
      orderBy: Object.keys(orderBy).length > 0 ? orderBy : undefined,
    });
  }

  async findOne(id: number) {
    return await this.prisma.post.findUnique({ where: { id }, include: { user: true } });
  }

  async update(data: UpdatePostDto) {
    return await this.prisma.post.update({ where: { id: data.id }, data });
  }

  async remove(id: number) {
    return await this.prisma.post.delete({ where: { id } });
  }
}
