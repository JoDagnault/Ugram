import { Response } from 'express';
import { Notification } from '../../domain/notifications/notification';
import { NotificationBus } from '../../domain/notifications/notification.bus';

// TODO SOON: This bus stores active SSE connections in memory on the current process.
// This works fine for a single-instance deployment, but not for multiple instances (e.g. multiple EC2/EB nodes), a user connected
// A distributed solution (liek Redis or Pub/Sub) would be needed to fix this.
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
            postId: notification.postId,
            type: notification.type,
            createdAt: notification.createdAt,
        });
        for (const res of this.connections.get(userId) ?? []) {
            res.write(`data: ${data}\n\n`);
        }
    }
}
