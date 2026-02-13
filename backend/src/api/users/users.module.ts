import { PrismaUserRepository } from '../../infrastructure/users/PrismaUserRepository';
import { getPrismaClient } from '../../infrastructure/prisma/client';
import { InMemoryUserRepository } from '../../infrastructure/users/user.repository.memory';
import { createUsersRouter } from './user.router';
import { UsersAssembler } from './assembler/users.assembler';
import { UpdateMeUsecase } from '../../application/users/update-me.usecase';
import { GetAllUsersUsecase } from '../../application/users/get-all-users.usecase';
import { GetMeUsecase } from '../../application/users/get-me.usecase';
import { GetUserUsecase } from '../../application/users/get-user.usecase';
import { UserController } from './user.controller';

export function createUsersModule() {
    const prisma = getPrismaClient();
    const userRepository =
        process.env.NODE_ENV === 'test'
            ? new InMemoryUserRepository()
            : new PrismaUserRepository(prisma);

    const getUser = new GetUserUsecase(userRepository);
    const getMe = new GetMeUsecase(userRepository);
    const getAllUsers = new GetAllUsersUsecase(userRepository);
    const updateMe = new UpdateMeUsecase(userRepository);

    const assembler = new UsersAssembler();
    const controller = new UserController(
        getUser,
        getMe,
        getAllUsers,
        updateMe,
        assembler,
    );
    const router = createUsersRouter(controller);

    return { router };
}
