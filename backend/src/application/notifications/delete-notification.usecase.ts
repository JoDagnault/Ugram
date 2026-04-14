import { NotificationRepository } from '../../domain/notifications/notification.repository';
import { ForbiddenError } from '../../errors/forbidden.error';
import { NotFoundError } from '../../errors/not-found.error';

export class DeleteNotificationUsecase {
    constructor(
        private readonly notificationRepository: NotificationRepository,
    ) {}

    async execute(notificationId: string, userId: string): Promise<void> {
        const notification =
            await this.notificationRepository.findById(notificationId);
        if (!notification) throw new NotFoundError('Notification not found');
        if (notification.userId !== userId)
            throw new ForbiddenError('Not your notification');
        await this.notificationRepository.delete(notificationId);
    }
}
