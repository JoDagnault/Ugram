import { Notification } from '../../domain/notifications/notification';
import { NotificationRepository } from '../../domain/notifications/notification.repository';
import { NotificationBus } from '../../domain/notifications/notification.bus';

export class CreateNotificationUsecase {
    constructor(
        private readonly notificationRepository: NotificationRepository,
        private readonly notificationBus: NotificationBus,
    ) {}

    async execute(
        userId: string,
        fromUserId: string,
        postId: string,
        type: string = 'mention',
    ): Promise<void> {
        const notification = new Notification(
            crypto.randomUUID(),
            userId,
            fromUserId,
            postId,
            type,
        );

        await this.notificationRepository.save(notification);
        this.notificationBus.send(userId, notification);
    }
}
