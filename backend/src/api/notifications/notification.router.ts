/**
 * @openapi
 * /users/me/notifications:
 *   get:
 *     summary: Get the authenticated user's notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 *       401:
 *         description: Unauthorized
 *
 * /users/me/notifications/stream:
 *   get:
 *     summary: Real-time notification stream (SSE)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: SSE event stream opened
 *       401:
 *         description: Unauthorized
 *
 * /users/me/notifications/{id}:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique notification ID.
 *     responses:
 *       204:
 *         description: Notification deleted
 *       404:
 *         description: Notification not found
 */
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
