import { Request, Response, NextFunction } from 'express';

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
    req.userId = 'user-123-hardcoded';
    next();
};
