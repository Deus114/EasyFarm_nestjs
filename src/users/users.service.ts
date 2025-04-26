import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async register(registerUserDto: RegisterUserDto) {
    const isExist = await this.prisma.user.findUnique({
      where: { email: registerUserDto.email },
    });
    if (isExist) {
      throw new BadRequestException(`Email: ${registerUserDto.email} đã tồn tại`);
    }

    const hashedPassword = this.getHashPassword(registerUserDto.password);

    const user = await this.prisma.user.create({
      data: {
        email: registerUserDto.email,
        password: hashedPassword,
        name: registerUserDto.name,
        role: registerUserDto.role || 'USER',
        refreshToken: '',
      },
    });

    return {
      id: user.id,
      createdAt: user.createdAt,
    };
  }

  async create(createUserDto: CreateUserDto) {
    const isExist = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (isExist) {
      throw new BadRequestException(`Email: ${createUserDto.email} đã tồn tại`);
    }

    const hashedPassword = this.getHashPassword(createUserDto.password);

    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        name: createUserDto.name,
        role: createUserDto.role || 'USER',
        refreshToken: '',
      },
    });

    return {
      id: user.id,
      createdAt: user.createdAt,
    };
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new BadRequestException(`User with id ${id} not found`);
    }
    return user;
  }

  async findOneByUserName(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto) {
    await this.findOne(updateUserDto.id); // Check user exists

    const updatedUser = await this.prisma.user.update({
      where: { id: updateUserDto.id },
      data: {
        name: updateUserDto.name,
        email: updateUserDto.email,
      },
    });

    return updatedUser;
  }

  async remove(id: number) {
    await this.findOne(id); // Check user exists

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: `User with id ${id} deleted successfully` };
  }

  async updateRefreshToken(refreshToken: string, id: number) {
    await this.prisma.user.update({
      where: { id },
      data: { refreshToken },
    });
  }

  async findUserByRefreshToken(refreshToken: string) {
    return this.prisma.user.findFirst({
      where: { refreshToken },
    });
  }
}
