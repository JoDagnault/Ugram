import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authMiddleware } from './middleware/auth.middleware';
import { UPLOAD_DIR } from './config/storage';
import { UserModule } from './api/users/user.module';
import { PostModule } from './api/posts/post.module';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(UPLOAD_DIR));
app.use(authMiddleware);

const postModule = PostModule();
const userModule = UserModule();

app.use('/posts', postModule.publicRouter);
app.use('/users', userModule.router);
userModule.router.use('/:userId/posts', postModule.anotherUserRouter);
userModule.router.use('/me/posts', postModule.meRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

export default app;
