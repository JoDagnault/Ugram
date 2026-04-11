import { Notification } from '../../domain/notifications/notification';
import { NotificationRepository } from '../../domain/notifications/notification.repository';
import { NotFoundError } from '../../errors/not-found.error';

export class InMemoryNotificationRepository implements NotificationRepository {
    private notifications: Notification[] = [];

    async save(notification: Notification): Promise<void> {
        this.notifications.push(notification);
    }

    async findByUserId(userId: string): Promise<Notification[]> {
        return [...this.notifications]
            .filter((n) => n.userId === userId)
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
            );
    }

    async findById(id: string): Promise<Notification> {
        const notification = this.notifications.find((n) => n.id === id);
        if (!notification) throw new NotFoundError('Notification not found');
        return notification;
    }

    async delete(id: string): Promise<void> {
        const index = this.notifications.findIndex((n) => n.id === id);
        if (index === -1) throw new NotFoundError('Notification not found');
        this.notifications.splice(index, 1);
    }
}
