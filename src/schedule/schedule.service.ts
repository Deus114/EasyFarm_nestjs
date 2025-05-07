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

    const repeatCrons = this.getRepeatCrons(schedule);
    const jobKeys: string[] = [];

    for (const cron of repeatCrons) {
      const job = await this.scheduleQueue.add(
        'send-notification',
        {
          userId: schedule.userId,
          title: schedule.title,
          description: schedule.description,
        },
        {
          repeat: { cron },
          removeOnComplete: false,
        },
      );

      const repeatOpts = job.opts.repeat as { cron?: string };
      if (repeatOpts.cron) {
        jobKeys.push(JSON.stringify({ cron: repeatOpts.cron, name: 'send-notification' }));
      }
    }

    await this.prisma.schedule.update({
      where: { id: schedule.id },
      data: { jobKeys },
    });

    return schedule;
  }

  getRepeatCrons(schedule: CreateScheduleDto): string[] {
    const [hour, minute] = schedule.startTime.split(':').map(Number);

    if (schedule.repeatType === 'DAILY') {
      return [`0 ${minute} ${hour} * * *`];
    }

    if (schedule.repeatType === 'WEEKLY') {
      return schedule.repeatDays.map((day) => `0 ${minute} ${hour} * * ${day}`);
    }

    if (schedule.repeatType === 'MONTHLY') {
      return schedule.repeatDates.map((date) => `0 ${minute} ${hour} ${date} * *`);
    }

    return [];
  }

  async pauseSchedule(id: number) {
    const schedule = await this.prisma.schedule.findUnique({ where: { id } });

    for (const key of schedule.jobKeys) {
      const { cron, name } = JSON.parse(key);
      await this.scheduleQueue.removeRepeatable(name, { cron });
    }

    return this.prisma.schedule.update({
      where: { id },
      data: { isActive: false, jobKeys: [] },
    });
  }

  async resumeSchedule(id: number) {
    const schedule = await this.prisma.schedule.findUnique({ where: { id } });

    const repeatCrons = this.getRepeatCrons(schedule);
    const jobKeys: string[] = [];

    for (const cron of repeatCrons) {
      const job = await this.scheduleQueue.add(
        'send-notification',
        {
          userId: schedule.userId,
          title: schedule.title,
          description: schedule.description,
        },
        {
          repeat: { cron },
          removeOnComplete: true,
        },
      );

      const repeatOpts = job.opts.repeat as { cron?: string };
      if (repeatOpts.cron) {
        jobKeys.push(JSON.stringify({ cron: repeatOpts.cron, name: 'send-notification' }));
      }
    }

    return this.prisma.schedule.update({
      where: { id },
      data: { isActive: true, jobKeys },
    });
  }

  async deleteSchedule(id: number) {
    const schedule = await this.prisma.schedule.findUnique({ where: { id } });

    for (const key of schedule.jobKeys) {
      const { cron, name } = JSON.parse(key);
      await this.scheduleQueue.removeRepeatable(name, { cron });
    }

    return this.prisma.schedule.delete({ where: { id } });
  }
}
