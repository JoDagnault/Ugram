import { Notification } from '../../domain/notifications/notification';
import { NotificationRepository } from '../../domain/notifications/notification.repository';

export class GetUserNotificationsUsecase {
    constructor(
        private readonly notificationRepository: NotificationRepository,
    ) {}

    async execute(userId: string): Promise<Notification[]> {
        return this.notificationRepository.findByUserId(userId);
    }
}
