import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { ScheduleProcessor } from './schedule.processor';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'schedule',
    }),
    NotificationsModule
  ],
  providers: [ScheduleService, ScheduleProcessor, PrismaService],
  controllers: [ScheduleController],
})
export class ScheduleModule { }
