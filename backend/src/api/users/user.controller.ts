import type { NextFunction, Request, Response } from 'express';
import type { GetMeUsecase } from '../../application/users/get-me.usecase';
import type { GetUserUsecase } from '../../application/users/get-user.usecase';
import { UsersAssembler } from './assembler/users.assembler';
import { GetAllUsersUsecase } from '../../application/users/get-all-users.usecase';
import { UpdateMeUsecase } from '../../application/users/update-me.usecase';
import { UpdateMeDto } from './dto/update-me.dto';
import { UserProfile } from '../../domain/users/user-profile';
import { UserValidator } from './assembler/user-fields-validator';
import { DeleteMeUsecase } from '../../application/users/delete-me.usecase';
import { logger } from '../../logger';

export class UserController {
    constructor(
        private readonly getUser: GetUserUsecase,
        private readonly getMe: GetMeUsecase,
        private readonly getAllUsers: GetAllUsersUsecase,
        private readonly updateMe: UpdateMeUsecase,
        private readonly deleteMe: DeleteMeUsecase,
        private readonly assembler: UsersAssembler,
    ) {}

    getMeHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId;
            const user: UserProfile = await this.getMe.execute(userId);

            if (!user)
                return res.status(404).json({ message: 'User not found' });
            return res.status(200).json(this.assembler.toDTO(user));
        } catch (error) {
            next(error);
        }
    };

    getUserByIdHandler = async (
        req: Request<{ id: string }>,
        res: Response,
        next: NextFunction,
    ) => {
        const { id } = req.params;
        try {
            const user: UserProfile | undefined =
                await this.getUser.execute(id);

            if (!user) {
                logger.warn('User not found', { targetId: id });
                return res.status(404).json({ message: 'User not found' });
            }

            return res
                .status(200)
                .json(this.assembler.toPublicProfileDTO(user));
        } catch (error: any) {
            logger.error('Failed to fetch user', {
                error: error.message,
                targetId: id,
            });
            next(error);
        }
    };

    getAllUsersHandler = async (_req: Request, res: Response) => {
        const users: UserProfile[] = await this.getAllUsers.execute();
        const dto = users.map((user) =>
            this.assembler.toPublicProfileDTO(user),
        );
        return res.status(200).json(dto);
    };

    updateMeHandler = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const usedId: string = req.userId;
            const fields: UpdateMeDto = req.body;

            UserValidator.validateUser(fields);

            const updated: UserProfile = await this.updateMe.execute(
                usedId,
                fields,
            );
            req.userLogger.info('User updated');
            return res.status(200).json(this.assembler.toDTO(updated));
        } catch (err: any) {
            req.userLogger.error('Failed to update user', {
                error: err.message,
            });
            next(err);
        }
    };

    deleteMeHandler = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.deleteMe.execute(req.userId!);
            req.userLogger.info('User deleted');
            return res.status(200).send();
        } catch (err: any) {
            req.userLogger.error('Failed to delete user', {
                error: err.message,
            });
            next(err);
        }
    };
}
