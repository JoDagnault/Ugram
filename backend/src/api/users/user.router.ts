/**
 * @openapi
 * /users/me:
 *   get:
 *     summary: Get the authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 *   patch:
 *     summary: Update the authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Public handle shown on the profile.
 *                 example: alex_photo
 *               profilePicture:
 *                 type: string
 *                 description: Public URL of the profile image.
 *                 example: https://example.com/avatar.jpg
 *     responses:
 *       200:
 *         description: Profile updated
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete the authenticated user's account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Account deleted
 *       401:
 *         description: Unauthorized
 *
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 *
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique user ID.
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
import { Router } from 'express';
import { UserController } from './user.controller';

export const createUsersRouter = (controller: UserController): Router => {
    const router: Router = Router();

    router.get('/me', controller.getMeHandler);
    router.get('/', controller.getAllUsersHandler);
    router.get('/:id', controller.getUserByIdHandler);
    router.patch('/me', controller.updateMeHandler);
    router.delete('/me', controller.deleteMeHandler);

    return router;
};
