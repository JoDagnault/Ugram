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
