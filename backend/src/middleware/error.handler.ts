import { HttpError } from '../errors/error';
import { NextFunction, Request, Response } from 'express';

export function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    res.setHeader('Content-Type', 'application/json');

    if (err instanceof HttpError) {
        return res
            .status(err.status)
            .json({ error: `${err.code}`, message: `${err.message}` });
    }

    console.error('Unexpected error:', err);

    return res
        .status(500)
        .json({ error: 'INTERNAL_ERROR', message: 'Something went wrong' });
}
