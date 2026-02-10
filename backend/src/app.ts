import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PostsRouter } from './api/posts/posts.router';
import { PostsService } from './application/posts/posts.service';
import { PostsController } from './api/posts/posts.controller';
import { InMemoryPostsRepository } from './infrastructure/posts/in-memory-posts-repository';
import path from 'path';
import { PostsAssembler } from './api/posts/assembler/posts.assembler';
import { authMiddleware } from './middleware/auth.middleware';
import { createUsersModule } from './api/users/users.module';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(authMiddleware);

const usersModule = createUsersModule();
app.use('/users', usersModule.router);

const postsRepository = new InMemoryPostsRepository();
const postsService = new PostsService(postsRepository);
const postsController = new PostsController(postsService, new PostsAssembler());
const postsRouter = new PostsRouter(postsController);
app.use('/posts', postsRouter.router);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

export default app;
