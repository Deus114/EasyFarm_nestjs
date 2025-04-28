import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectQueue('schedule') private readonly scheduleQueue: Queue,
    private readonly prisma: PrismaService,
  ) { }

  async createSchedule(createDto: CreateScheduleDto) {
    const schedule = await this.prisma.schedule.create({
      data: createDto,
    });

    await this.scheduleQueue.add(
      'send-notification',
      {
        userId: schedule.userId,
        title: schedule.title,
        description: schedule.description
      },
      {
        repeat: this.getRepeatOptions(schedule),
        removeOnComplete: true,
      },
    );

    return schedule;
  }

  getRepeatOptions(schedule: any) {
    const [hour, minute] = schedule.startTime.split(':').map(Number);

    if (schedule.repeatType === 'DAILY') {
      return { cron: `0 ${minute} ${hour} * * *` };
    }
    if (schedule.repeatType === 'WEEKLY') {
      const days = schedule.repeatDays.join(',');
      return { cron: `0 ${minute} ${hour} * * ${days}` };
    }
    if (schedule.repeatType === 'MONTHLY') {
      const dates = schedule.repeatDates.join(',');
      return { cron: `0 ${minute} ${hour} ${dates} * *` };
    }
  }

  async pauseSchedule(id: number) {
    return this.prisma.schedule.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async resumeSchedule(id: number) {
    return this.prisma.schedule.update({
      where: { id },
      data: { isActive: true },
    });
  }

  async deleteSchedule(id: number) {
    return this.prisma.schedule.delete({
      where: { id },
    });
  }
}
