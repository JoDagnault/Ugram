import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GetUser } from './application/users/GetUser';
import { createUsersRouter } from './api/users/usersRouter';
import { InMemoryUserRepository } from './infrastructure/users/InMemoryUserRepository';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const userRepository = new InMemoryUserRepository();
const getUser = new GetUser(userRepository);

app.use('/users', createUsersRouter({ getUser }));

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

export default app;
