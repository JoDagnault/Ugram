import { Router, type Request, type Response } from 'express';
import type { GetUser } from '../../application/users/GetUser';

type Dependencies = {
    getUser: GetUser;
};

type UserParams = {
    id: string;
};

export const createUsersRouter = ({ getUser }: Dependencies): Router => {
    const router = Router();

    router.get('/:id', async (req: Request<UserParams>, res: Response) => {
        const { id } = req.params;
        const user = await getUser.execute(id);
        if (!user) return res.sendStatus(404);
        return res.json(user);
    });

    return router;
};
