import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';

@Injectable()
export class SensorsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createSensorDto: CreateSensorDto) {
    return this.prisma.sensor.create({
      data: {
        ...createSensorDto,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.sensor.findMany({
      where: { userId },
    });
  }

  async findOne(id: number) {
    return this.prisma.sensor.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateSensorDto: UpdateSensorDto) {
    return this.prisma.sensor.update({
      where: { id },
      data: updateSensorDto,
    });
  }

  async remove(id: number) {
    return this.prisma.sensor.delete({
      where: { id },
    });
  }
}
