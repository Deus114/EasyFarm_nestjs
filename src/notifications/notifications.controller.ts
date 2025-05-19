// notifications.controller.ts
import { Controller, Delete, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // nếu có authentication
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @ResponseMessage('Lấy tất cả thông báo của user thành công')
  @Get()
  async findAll(@User() user: IUser) {
    const userId = user.id;
    return this.notificationsService.getNotifications(userId);
  }

  @Patch(':id/read')
  @ResponseMessage('Đã dấu thông báo đã đọc thành công')
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(Number(id));
  }

  @Delete(':id')
  @ResponseMessage('Xóa thông báo thành công')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }
}
