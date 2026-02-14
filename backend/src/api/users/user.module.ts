import { InMemoryUserRepository } from '../../infrastructure/users/user.repository.memory';
import { GetUserUsecase } from '../../application/users/get-user.usecase';
import { GetMeUsecase } from '../../application/users/get-me.usecase';
import { GetAllUsersUsecase } from '../../application/users/get-all-users.usecase';
import { UpdateMeUsecase } from '../../application/users/update-me.usecase';
import { UsersAssembler } from './assembler/users.assembler';
import { UserController } from './user.controller';
import { createUsersRouter } from './user.router';
import { Router } from 'express';
import { getPrismaClient } from '../../infrastructure/prisma/client';
import { PrismaUserRepository } from '../../infrastructure/users/user.repository.prisma';

export function UserModule() {
    const isDev =
        process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
    const userRepository =
        process.env.NODE_ENV === 'test' || isDev
            ? new InMemoryUserRepository()
            : new PrismaUserRepository(getPrismaClient());

    const getUser: GetUserUsecase = new GetUserUsecase(userRepository);
    const getMe: GetMeUsecase = new GetMeUsecase(userRepository);
    const getAllUsers: GetAllUsersUsecase = new GetAllUsersUsecase(
        userRepository,
    );
    const updateMe: UpdateMeUsecase = new UpdateMeUsecase(userRepository);

    const assembler: UsersAssembler = new UsersAssembler();
    const userController: UserController = new UserController(
        getUser,
        getMe,
        getAllUsers,
        updateMe,
        assembler,
    );
    const router: Router = createUsersRouter(userController);

    return { router };
}
