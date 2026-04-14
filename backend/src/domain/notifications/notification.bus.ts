import { Notification } from './notification';

export interface NotificationBus {
    send(userId: string, notification: Notification): void;
}
