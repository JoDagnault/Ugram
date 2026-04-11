import { PrismaClient } from '../../generated/prisma';
import { Notification } from '../../domain/notifications/notification';
import { NotificationRepository } from '../../domain/notifications/notification.repository';

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

    async findById(id: string): Promise<Notification | null> {
        const row = await this.prisma.notification.findUnique({
            where: { id },
            include: { fromUser: true },
        });
        if (!row) return null;
        return new Notification(
            row.id,
            row.userId,
            row.fromUserId,
            row.postId,
            row.type,
            row.fromUser.username,
            row.createdAt.toISOString(),
        );
    }

    async delete(id: string): Promise<void> {
        await this.prisma.notification.delete({ where: { id } });
    }

    async findByUserId(userId: string): Promise<Notification[]> {
        const rows = await this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: { fromUser: true },
        });

        return rows.map(
            (r) =>
                new Notification(
                    r.id,
                    r.userId,
                    r.fromUserId,
                    r.postId,
                    r.type,
                    r.fromUser.username,
                    r.createdAt.toISOString(),
                ),
        );
    }
}
