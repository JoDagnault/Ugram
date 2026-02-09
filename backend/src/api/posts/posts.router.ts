import { Router } from 'express';
import multer from 'multer';
import { PostsController } from './posts.controller';
import path from 'path';
import fs from 'fs';
import { authMiddleware } from '../../middleware/auth.middleware';

const uploadDir = path.join(__dirname, '../../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    },
});

const upload = multer({ storage });

export class PostsRouter {
    public router: Router;
    constructor(private postsController: PostsController) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(
            '/',
            authMiddleware,
            upload.single('image'),
            this.postsController.createPost,
        );
        this.router.get('/', this.postsController.getAllPosts);
        this.router.get('/:id', this.postsController.getPostById);
        this.router.delete('/:id', this.postsController.delete);
        this.router.patch('/:id', this.postsController.update);
    }
}
