import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage } from 'src/decorator/customize';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ResponseMessage('Tạo mới người dùng thành công')
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto
  ) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id')
  id: number
  ) {
    return this.usersService.findOne(id);
  }

  @ResponseMessage('Cập nhật người dùng thành công')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto) {
    let updatedUser = await this.usersService.update(+id, updateUserDto);
    return updatedUser;
  }

  @ResponseMessage('Xóa người dùng thành công')
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(+id);
  }
}
