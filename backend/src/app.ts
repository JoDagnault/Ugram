import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authMiddleware } from './middleware/auth.middleware';
import { UPLOAD_DIR } from './config/storage';
import { UserModule } from './api/users/user.module';
import { PostModule } from './api/posts/post.module';
import { errorHandler } from './middleware/error.handler';
import { AuthModule } from './api/auth/auth.module';
import { createHealthRouter } from './api/health/health.router';
import { httpLogger } from './middleware/httpLogger';

dotenv.config();

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

const postModule = PostModule();
const userModule = UserModule(postModule.postRepository);
const authModule = AuthModule(userModule.userRepository);

app.use('/users', authMiddleware, userModule.router);
app.use('/posts', authMiddleware, postModule.publicRouter);

app.use('/auth', authModule.authRouter);
userModule.router.use('/:userId/posts', postModule.anotherUserRouter);
userModule.router.use('/me/posts', postModule.meRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

app.use(errorHandler);

export default app;
