import { PrismaClient } from '../../generated/prisma';
import { Notification } from '../../domain/notifications/notification';
import { NotificationRepository } from '../../domain/notifications/notification.repository';
import { NotificationType } from '../../domain/notifications/notification-type';
import { NotFoundError } from '../../errors/not-found.error';

export class PrismaNotificationRepository implements NotificationRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async save(notification: Notification): Promise<void> {
        await this.prisma.notification.create({
            data: {
                id: notification.id,
                userId: notification.userId,
                fromUserId: notification.fromUserId,
                postId: notification.postId,
                type: notification.type,
                createdAt: new Date(notification.createdAt),
            },
        });
    }

    async findById(id: string): Promise<Notification> {
        const row = await this.prisma.notification.findUnique({
            where: { id },
        });
        if (!row) throw new NotFoundError('Notification not found');
        return new Notification(
            row.id,
            row.userId,
            row.fromUserId,
            row.postId,
            row.type as NotificationType,
            row.createdAt.toISOString(),
        );
    }

    async delete(id: string): Promise<void> {
        try {
            await this.prisma.notification.delete({ where: { id } });
        } catch {
            throw new NotFoundError('Notification not found');
        }
    }

    async findByUserId(userId: string): Promise<Notification[]> {
        const rows = await this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        return rows.map(
            (r) =>
                new Notification(
                    r.id,
                    r.userId,
                    r.fromUserId,
                    r.postId,
                    r.type as NotificationType,
                    r.createdAt.toISOString(),
                ),
        );
    }
}
