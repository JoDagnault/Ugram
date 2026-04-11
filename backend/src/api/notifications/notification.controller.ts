import { NextFunction, Request, Response } from 'express';
import { GetUserNotificationsUsecase } from '../../application/notifications/get-user-notifications.usecase';
import { DeleteNotificationUsecase } from '../../application/notifications/delete-notification.usecase';
import { SseNotificationBus } from '../../infrastructure/notifications/sse-notification.bus';
import { UserRepository } from '../../domain/users/user.repository';

export class NotificationController {
    constructor(
        private readonly getUserNotifications: GetUserNotificationsUsecase,
        private readonly deleteNotification: DeleteNotificationUsecase,
        private readonly notificationBus: SseNotificationBus,
        private readonly userRepository: UserRepository,
    ) {}

    getNotificationsHandler = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const notifications = await this.getUserNotifications.execute(
                req.userId!,
            );
            const result = await Promise.all(
                notifications.map(async (n) => {
                    const fromUser = await this.userRepository.findById(
                        n.fromUserId,
                    );
                    return {
                        id: n.id,
                        fromUserId: n.fromUserId,
                        fromUsername: fromUser.username,
                        postId: n.postId,
                        type: n.type,
                        createdAt: n.createdAt,
                    };
                }),
            );
            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    deleteNotificationHandler = async (
        req: Request<{ id: string }>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.deleteNotification.execute(req.params.id, req.userId!);
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    };

    streamHandler = (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        const userId = req.userId!;
        this.notificationBus.register(userId, res);

        const heartbeat = setInterval(() => res.write(':heartbeat\n\n'), 30000);

        req.on('close', () => {
            clearInterval(heartbeat);
            this.notificationBus.unregister(userId, res);
        });
    };
}
