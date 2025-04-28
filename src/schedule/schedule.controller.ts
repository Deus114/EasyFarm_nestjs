import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) { }

  @Post()
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.createSchedule(createScheduleDto);
  }

  @Patch(':id/pause')
  pause(@Param('id') id: string) {
    return this.scheduleService.pauseSchedule(+id);
  }

  @Patch(':id/resume')
  resume(@Param('id') id: string) {
    return this.scheduleService.resumeSchedule(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleService.deleteSchedule(+id);
  }
}
