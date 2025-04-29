import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { NotificationsService } from 'src/notifications/notifications.service';

@Processor('schedule')
@Injectable()
export class ScheduleProcessor {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Process('send-notification')
    async handleScheduleNotification(job: Job) {
        const { userId, title, description } = job.data;
        console.log('⏰ Job fired: send-notification', job.data);
        // Chỉ tạo 1 thông báo trong database
        await this.notificationsService.createNotification(
            userId,
            `Đã đến giờ thực hiện lịch: ${title}`,
            description
        );
    }
}
