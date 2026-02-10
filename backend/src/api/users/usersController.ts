import type { Request, Response } from 'express';
import type { GetMe } from '../../application/users/GetMe';
import type { GetUser } from '../../application/users/GetUser';
import { UsersAssembler } from './assembler/users.assembler';

export class UsersController {
    constructor(
        private readonly getUser: GetUser,
        private readonly getMe: GetMe,
        private readonly assembler: UsersAssembler,
    ) {}

    getMeHandler = async (req: Request, res: Response) => {
        const userId = req.userId;
        const user = await this.getMe.execute(userId);

        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.status(200).json(this.assembler.toDTO(user));
    };

    getUserByIdHandler = async (
        req: Request<{ id: string }>,
        res: Response,
    ) => {
        const { id } = req.params;
        const user = await this.getUser.execute(id);

        if (!user) return res.sendStatus(404);
        return res.status(200).json(this.assembler.toDTO(user));
    };
}
