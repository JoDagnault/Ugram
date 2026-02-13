import type { Request, Response } from 'express';
import type { GetMeUsecase } from '../../application/users/get-me.usecase';
import type { GetUserUsecase } from '../../application/users/get-user.usecase';
import { UsersAssembler } from './assembler/users.assembler';
import { GetAllUsersUsecase } from '../../application/users/get-all-users.usecase';
import { UpdateMeUsecase } from '../../application/users/update-me.usecase';
import { UpdateMeDto } from './dto/update-me.dto';
import { UserProfile } from '../../domain/users/user-profile';
import { UserResponseDTO } from './dto/user-response.dto';
import { UserValidator } from './assembler/user-fields-validator';

export class UserController {
    constructor(
        private readonly getUser: GetUserUsecase,
        private readonly getMe: GetMeUsecase,
        private readonly getAllUsers: GetAllUsersUsecase,
        private readonly updateMe: UpdateMeUsecase,
        private readonly assembler: UsersAssembler,
    ) {}

    getMeHandler = async (req: Request, res: Response) => {
        const userId = req.userId;
        const user: UserProfile | undefined = await this.getMe.execute(userId);

        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.status(200).json(this.assembler.toDTO(user));
    };

    getUserByIdHandler = async (
        req: Request<{ id: string }>,
        res: Response,
    ) => {
        try {
            const { id } = req.params;
            const user: UserProfile | undefined =
                await this.getUser.execute(id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json(this.assembler.toDTO(user));
        } catch (error: any) {
            let message: string = 'Internal server error';
            if (error instanceof Error) {
                message = error.message;
            }
            return res.status(500).json({ message });
        }
    };

    getAllUsersHandler = async (_req: Request, res: Response) => {
        const users: UserProfile[] = await this.getAllUsers.execute();
        const dto: UserResponseDTO[] = users.map((user) =>
            this.assembler.toDTO(user),
        );
        return res.status(200).json(dto);
    };

    updateMeHandler = async (req: Request, res: Response) => {
        try {
            const usedId: string = req.userId;
            const fields: UpdateMeDto = req.body;

            UserValidator.validateUser(fields);

            const updated: UserProfile = await this.updateMe.execute(
                usedId,
                fields,
            );
            return res.status(200).json(this.assembler.toDTO(updated));
        } catch (err: any) {
            return res.status(400).json({ message: err.message });
        }
    };
}
