import { Router } from 'express';
import { NotificationController } from './notification.controller';

export class NotificationRouter {
    public router: Router;

    constructor(controller: NotificationController) {
        this.router = Router();
        this.router.get('/', controller.getNotificationsHandler);
        this.router.get('/stream', controller.streamHandler);
        this.router.delete('/:id', controller.deleteNotificationHandler);
    }
}
