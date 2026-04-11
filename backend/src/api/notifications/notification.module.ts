import { PrismaNotificationRepository } from '../../infrastructure/notifications/notification.repository.prisma';
import { SseNotificationBus } from '../../infrastructure/notifications/sse-notification.bus';
import { CreateNotificationUsecase } from '../../application/notifications/create-notification.usecase';
import { GetUserNotificationsUsecase } from '../../application/notifications/get-user-notifications.usecase';
import { DeleteNotificationUsecase } from '../../application/notifications/delete-notification.usecase';
import { NotificationController } from './notification.controller';
import { NotificationRouter } from './notification.router';
import { getPrismaClient } from '../../infrastructure/prisma/client';
import { UserRepository } from '../../domain/users/user.repository';

export function NotificationModule(userRepository: UserRepository) {
    const notificationRepository = new PrismaNotificationRepository(
        getPrismaClient(),
    );

    const notificationBus = new SseNotificationBus();

    const createNotification = new CreateNotificationUsecase(
        notificationRepository,
        notificationBus,
    );
    const getUserNotifications = new GetUserNotificationsUsecase(
        notificationRepository,
    );
    const deleteNotification = new DeleteNotificationUsecase(
        notificationRepository,
    );

    const controller = new NotificationController(
        getUserNotifications,
        deleteNotification,
        notificationBus,
    );
    const { router } = new NotificationRouter(controller);

    return { router, createNotification };
}
