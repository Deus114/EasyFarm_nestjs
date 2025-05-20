import { Controller, Post, Body, Patch, Param, Delete, Get } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ResponseMessage } from 'src/decorator/customize';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) { }

  @Post()
  @ResponseMessage('Tạo lịch hẹn thành công')
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.createSchedule(createScheduleDto);
  }

  @ResponseMessage('Lấy tất cả lịch hẹn của người dùng thành công')
  @Get(':userId')
  findAll(@Param('userId') userId: string) {
    return this.scheduleService.findAll(+userId);
  }

  @ResponseMessage('Lấy lịch hẹn của người dùng thành công')
  @Get(':id/detail')
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(+id);
  }

  @Patch(':id/pause')
  @ResponseMessage('Dừng lịch hẹn thành công')
  pause(@Param('id') id: string) {
    return this.scheduleService.pauseSchedule(+id);
  }

  @ResponseMessage('Cập nhật lịch hẹn thành công')
  @Patch(':id/resume')
  resume(@Param('id') id: string) {
    return this.scheduleService.resumeSchedule(+id);
  }

  @ResponseMessage('Xóa lịch hẹn thành công')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleService.deleteSchedule(+id);
  }
}
