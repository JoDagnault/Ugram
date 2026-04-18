/**
 * @openapi
 * /health:
 *   get:
 *     summary: Check server health
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: The server is healthy
 *       503:
 *         description: The server is unavailable
 */
import { Router } from 'express';
import { getPrismaClient } from '../../infrastructure/prisma/client';
import { logger } from '../../logger';

export function createHealthRouter(): Router {
    const router = Router();

    router.get('/', async (_req, res) => {
        try {
            await getPrismaClient().$queryRaw`SELECT 1`;
            logger.debug('Health check passed');
            res.status(200).send('healthy');
        } catch (error: any) {
            logger.error('Health check failed', { error: error.message });
            res.status(503).send('unhealthy');
        }
    });

    return router;
}
