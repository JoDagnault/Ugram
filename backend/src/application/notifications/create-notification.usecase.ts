import { Notification } from '../../domain/notifications/notification';
import { NotificationRepository } from '../../domain/notifications/notification.repository';
import { NotificationBus } from '../../domain/notifications/notification.bus';
import { UserRepository } from '../../domain/users/user.repository';

export class CreateNotificationUsecase {
    constructor(
        private readonly notificationRepository: NotificationRepository,
        private readonly notificationBus: NotificationBus,
        private readonly userRepository: UserRepository,
    ) {}

    async execute(
        userId: string,
        fromUserId: string,
        postId: string,
        type: string = 'mention',
    ): Promise<void> {
        const fromUser = await this.userRepository.findById(fromUserId);
        const notification = new Notification(
            crypto.randomUUID(),
            userId,
            fromUserId,
            postId,
            type,
            new Date().toISOString(),
            fromUser.username,
        );

        await this.notificationRepository.save(notification);
        this.notificationBus.send(userId, notification);
    }
}
