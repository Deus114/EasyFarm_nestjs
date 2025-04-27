import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreatePostDto) {
    return await this.prisma.post.create({ data });
  }

  async findAll() {
    return await this.prisma.post.findMany({ include: { user: true } });
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
