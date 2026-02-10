import { Router } from 'express';
import type { GetUser } from '../../application/users/GetUser';
import type { GetMe } from '../../application/users/GetMe';
import { UsersController } from './usersController';
import { UsersAssembler } from './assembler/users.assembler';

type Dependencies = {
    getUser: GetUser;
    getMe: GetMe;
};

export const createUsersRouter = ({ getUser, getMe }: Dependencies): Router => {
    const router = Router();
    const controller = new UsersController(
        getUser,
        getMe,
        new UsersAssembler(),
    );

    router.get('/me', controller.getMeHandler);
    router.get('/:id', controller.getUserByIdHandler);

    return router;
};
