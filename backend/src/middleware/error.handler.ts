import { HttpError } from '../errors/error';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';

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

    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            error: 'BAD_REQUEST',
            message: 'Image is too large',
        });
    }

    console.error('Unexpected error:', err);

    return res
        .status(500)
        .json({ error: 'INTERNAL_ERROR', message: 'Something went wrong' });
}
