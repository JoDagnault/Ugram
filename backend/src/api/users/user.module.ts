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
import { DeleteMeUsecase } from '../../application/users/delete-me.usecase';
import { InMemoryPostsRepository } from '../../infrastructure/posts/post.repository.memory';
import { PrismaPostRepository } from '../../infrastructure/posts/post.repository.prisma';

export function UserModule(
    postRepository: InMemoryPostsRepository | PrismaPostRepository,
) {
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
    const deleteMe: DeleteMeUsecase = new DeleteMeUsecase(
        userRepository,
        postRepository,
    );

    const assembler: UsersAssembler = new UsersAssembler();
    const userController: UserController = new UserController(
        getUser,
        getMe,
        getAllUsers,
        updateMe,
        deleteMe,
        assembler,
    );
    const router: Router = createUsersRouter(userController);

    return { router, userRepository };
}
