import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) { }

  async createNotification(userId: number, title: string, description: string) {
    return this.prisma.notification.create({
      data: {
        userId,
        title,
        description,
      },
    });
  }

  async getNotifications(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(notificationId: number) {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async remove(id: number) {
    return await this.prisma.notification.delete({ where: { id } });
  }
}
