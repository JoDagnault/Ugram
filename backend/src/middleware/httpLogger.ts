import { Request, Response, NextFunction } from 'express';
import { logger } from '../logger';

export const httpLogger = (req: Request, res: Response, next: NextFunction) => {
    res.on('finish', () => {
        logger.http(`${req.method} ${req.originalUrl} ${res.statusCode}`, {
            ip: req.ip,
            userAgent: req.get('user-agent'),
        });
    });
    next();
};
