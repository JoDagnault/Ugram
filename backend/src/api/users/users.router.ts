import { Router } from 'express';
import { UsersController } from './users.controller';

export const createUsersRouter = (controller: UsersController): Router => {
    const router = Router();

    router.get('/me', controller.getMeHandler);
    router.get('/', controller.getAllUsersHandler);
    router.get('/:id', controller.getUserByIdHandler);
    router.patch('/me', controller.updateMeHandler);

    return router;
};
