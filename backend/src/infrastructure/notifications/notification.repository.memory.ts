import { Notification } from '../../domain/notifications/notification';
import { NotificationRepository } from '../../domain/notifications/notification.repository';

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

    async findById(id: string): Promise<Notification | null> {
        return this.notifications.find((n) => n.id === id) ?? null;
    }

    async delete(id: string): Promise<void> {
        this.notifications = this.notifications.filter((n) => n.id !== id);
    }
}
