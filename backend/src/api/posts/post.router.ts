import { Router } from 'express';
import multer from 'multer';
import { PostController } from './post.controller';
import path from 'path';
import fs from 'fs';
import { UPLOAD_DIR } from '../../config/storage';

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_DIR);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    },
});

const upload = multer({ storage });

export class PostRouter {
    public router: Router;
    constructor(private postsController: PostController) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(
            '/',
            upload.single('image'),
            this.postsController.createPostHandler,
        );
        this.router.get('/', this.postsController.getAllPostsHandler);
        this.router.get('/:id', this.postsController.getPostByIdHandler);
        this.router.delete('/:id', this.postsController.deletePostHandler);
        this.router.patch('/:id', this.postsController.updatePostHandler);
    }
}
