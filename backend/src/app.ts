import express, { Request, Response } from 'express';
import cors from 'cors';
import { authMiddleware } from './middleware/auth.middleware';
import { UPLOAD_DIR } from './config/storage';
import { UserModule } from './api/users/user.module';
import { PostModule } from './api/posts/post.module';
import { NotificationModule } from './api/notifications/notification.module';
import { errorHandler } from './middleware/error.handler';
import { AuthModule } from './api/auth/auth.module';
import { createHealthRouter } from './api/health/health.router';
import { httpLogger } from './middleware/httpLogger';
import { PrismaUserRepository } from './infrastructure/users/user.repository.prisma';
import { PrismaRevokedTokenRepository } from './infrastructure/auth/revoked-token.repository.prisma';
import { getPrismaClient } from './infrastructure/prisma/client';
import { PrismaPostRepository } from './infrastructure/posts/post.repository.prisma';

const app = express();

app.use(cors());
app.use(express.json());
app.use(httpLogger);

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
    next();
});

app.use('/health', createHealthRouter());
app.use('/uploads', express.static(UPLOAD_DIR));

const prisma = getPrismaClient();
const userRepository = new PrismaUserRepository(prisma);
const revokedTokenRepository = new PrismaRevokedTokenRepository(prisma);
const postRepository = new PrismaPostRepository(prisma);

const notificationModule = NotificationModule(userRepository);
const postModule = PostModule(
    postRepository,
    userRepository,
    notificationModule.createNotification,
);
const userModule = UserModule(userRepository);
const authModule = AuthModule(userRepository, revokedTokenRepository);

app.use('/users', authMiddleware(revokedTokenRepository), userModule.router);
app.use(
    '/posts',
    authMiddleware(revokedTokenRepository),
    postModule.publicRouter,
);

app.use('/auth', authModule.authRouter);
userModule.router.use('/:userId/posts', postModule.anotherUserRouter);
userModule.router.use('/me/posts', postModule.meRouter);
userModule.router.use('/me/notifications', notificationModule.router);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

app.use(errorHandler);

export default app;
