// notifications.controller.ts
import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // nếu có authentication
import { User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @Get()
  async findAll(@User() user: IUser) {
    const userId = user.id;
    return this.notificationsService.getNotifications(userId);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(Number(id));
  }
}
