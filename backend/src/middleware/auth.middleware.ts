import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../logger';

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        logger.warn('Auth attempt with no token', { path: req.path });
        res.status(401).json({ message: 'No token provided' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            userId: string;
        };
        req.userId = decoded.userId;
        const log = (
            level: string,
            msg: string,
            meta?: Record<string, unknown>,
        ) => logger.log(level, msg, { ...meta, userId: req.userId });
        req.userLogger = {
            info: (msg, meta) => log('info', msg, meta),
            warn: (msg, meta) => log('warn', msg, meta),
            error: (msg, meta) => log('error', msg, meta),
            http: (msg, meta) => log('http', msg, meta),
            debug: (msg, meta) => log('debug', msg, meta),
        };
        next();
    } catch {
        logger.warn('Auth attempt with invalid token', { path: req.path });
        res.status(401).json({ message: 'Invalid token' });
    }
};
