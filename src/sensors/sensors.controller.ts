import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';

@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorService: SensorsService) { }

  @Post()
  async create(
    @Body() createSensorDto: CreateSensorDto,
  ) {
    return this.sensorService.create(createSensorDto);
  }

  @Get(':userId')
  async findAll(@Param('userId') userId: string) {
    return this.sensorService.findAll(Number(userId));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.sensorService.findOne(Number(id));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSensorDto: UpdateSensorDto,
  ) {
    return this.sensorService.update(Number(id), updateSensorDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.sensorService.remove(Number(id));
  }
}
