import { Response } from 'express';
import { Notification } from '../../domain/notifications/notification';
import { NotificationBus } from '../../domain/notifications/notification.bus';

export class SseNotificationBus implements NotificationBus {
    private connections = new Map<string, Response[]>();

    register(userId: string, res: Response): void {
        const existing = this.connections.get(userId) ?? [];
        this.connections.set(userId, [...existing, res]);
    }

    unregister(userId: string, res: Response): void {
        const existing = this.connections.get(userId) ?? [];
        this.connections.set(
            userId,
            existing.filter((r) => r !== res),
        );
    }

    send(userId: string, notification: Notification): void {
        const data = JSON.stringify({
            id: notification.id,
            fromUserId: notification.fromUserId,
            fromUsername: notification.fromUsername,
            postId: notification.postId,
            type: notification.type,
            createdAt: notification.createdAt,
        });
        for (const res of this.connections.get(userId) ?? []) {
            res.write(`data: ${data}\n\n`);
        }
    }
}
