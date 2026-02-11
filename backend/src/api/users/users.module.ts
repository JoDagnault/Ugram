import { InMemoryUserRepository } from '../../infrastructure/users/InMemoryUserRepository';
import { GetUser } from '../../application/users/GetUser';
import { GetMe } from '../../application/users/GetMe';
import { GetAllUsers } from '../../application/users/GetAllUsers';
import { UpdateMe } from '../../application/users/UpdateMe';
import { UsersAssembler } from './assembler/users.assembler';
import { UsersController } from './users.controller';
import { createUsersRouter } from './users.router';

export function createUsersModule() {
    const userRepository = new InMemoryUserRepository();

    const getUser = new GetUser(userRepository);
    const getMe = new GetMe(userRepository);
    const getAllUsers = new GetAllUsers(userRepository);
    const updateMe = new UpdateMe(userRepository);

    const assembler = new UsersAssembler();
    const controller = new UsersController(
        getUser,
        getMe,
        getAllUsers,
        updateMe,
        assembler,
    );
    const router = createUsersRouter(controller);

    return { router };
}
