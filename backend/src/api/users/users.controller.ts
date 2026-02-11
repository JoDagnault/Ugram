import type { Request, Response } from 'express';
import type { GetMe } from '../../application/users/GetMe';
import type { GetUser } from '../../application/users/GetUser';
import { UsersAssembler } from './assembler/users.assembler';
import { GetAllUsers } from '../../application/users/GetAllUsers';
import { UpdateMe } from '../../application/users/UpdateMe';
import { UpdateMeDto } from './dto/update-me.dto';

export class UsersController {
    constructor(
        private readonly getUser: GetUser,
        private readonly getMe: GetMe,
        private readonly getAllUsers: GetAllUsers,
        private readonly updateMe: UpdateMe,
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

    getAllUsersHandler = async (_req: Request, res: Response) => {
        const users = await this.getAllUsers.execute();
        const dto = users.map((user) => this.assembler.toDTO(user));
        return res.status(200).json(dto);
    };

    updateMeHandler = async (req: Request, res: Response) => {
        try {
            const usedId = req.userId;
            const fields: UpdateMeDto = req.body;

            const updated = await this.updateMe.execute(usedId, fields);
            return res.status(200).json(this.assembler.toDTO(updated));
        } catch (err: any) {
            return res.status(400).json({ message: err.message });
        }
    };
}
