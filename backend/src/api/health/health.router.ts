import { Router } from 'express';
import { getPrismaClient } from '../../infrastructure/prisma/client';

export function createHealthRouter(): Router {
    const router = Router();

    router.get('/', async (_req, res) => {
        try {
            await getPrismaClient().$queryRaw`SELECT 1`;
            res.status(200).send('healthy');
        } catch {
            res.status(503).send('unhealthy');
        }
    });

    return router;
}
