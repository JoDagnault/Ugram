import { GetUserUsecase } from '../../application/users/get-user.usecase';
import { GetMeUsecase } from '../../application/users/get-me.usecase';
import { GetAllUsersUsecase } from '../../application/users/get-all-users.usecase';
import { UpdateMeUsecase } from '../../application/users/update-me.usecase';
import { UsersAssembler } from './assembler/users.assembler';
import { UserController } from './user.controller';
import { createUsersRouter } from './user.router';
import { Router } from 'express';
import { DeleteMeUsecase } from '../../application/users/delete-me.usecase';
import { UserRepository } from '../../domain/users/user.repository';

export function UserModule(userRepository: UserRepository) {
    const getUser: GetUserUsecase = new GetUserUsecase(userRepository);
    const getMe: GetMeUsecase = new GetMeUsecase(userRepository);
    const getAllUsers: GetAllUsersUsecase = new GetAllUsersUsecase(
        userRepository,
    );
    const updateMe: UpdateMeUsecase = new UpdateMeUsecase(userRepository);
    const deleteMe: DeleteMeUsecase = new DeleteMeUsecase(userRepository);

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

    return { router };
}
