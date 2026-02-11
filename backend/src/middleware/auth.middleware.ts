import { Request, Response, NextFunction } from 'express';
import { ME_USER_ID } from '../infrastructure/users/user.repository.memory';

declare global {
    namespace Express {
        interface Request {
            userId: string;
        }
    }
}

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    req.userId = ME_USER_ID;
    next();
};
