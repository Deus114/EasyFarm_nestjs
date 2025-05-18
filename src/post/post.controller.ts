import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ResponseMessage } from 'src/decorator/customize';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Post()
  @ResponseMessage('Tạo bài viết thành công')
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get()
  @ResponseMessage('Lấy dữ liệu tất cả bài viết thành công')
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  @ResponseMessage('Lấy dữ liệu bài viết thành công')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật bài viết thành công')
  update(@Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(updatePostDto);
  }

  @Delete(':id')
  @ResponseMessage('Xóa bài viết thành công')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
