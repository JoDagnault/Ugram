import { Notification } from '../../domain/notifications/notification';
import { NotificationRepository } from '../../domain/notifications/notification.repository';
import { NotificationBus } from '../../domain/notifications/notification.bus';

export class CreateNotificationUsecase {
    constructor(
        private readonly notificationRepository: NotificationRepository,
        private readonly notificationBus: NotificationBus,
    ) {}

    async execute(notification: Notification): Promise<void> {
        await this.notificationRepository.save(notification);
        this.notificationBus.send(notification.userId, notification);
    }
}
