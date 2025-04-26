import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) { }

  create(data: CreatePostDto) {
    return this.prisma.post.create({ data });
  }

  findAll() {
    return this.prisma.post.findMany({ include: { user: true } });
  }

  findOne(id: number) {
    return this.prisma.post.findUnique({ where: { id }, include: { user: true } });
  }

  update(data: UpdatePostDto) {
    return this.prisma.post.update({ where: { id: data.id }, data });
  }

  remove(id: number) {
    return this.prisma.post.delete({ where: { id } });
  }
}
