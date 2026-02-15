import { Router } from 'express';
import multer, { Multer, StorageEngine } from 'multer';
import { PostController } from './post.controller';
import path from 'path';
import fs from 'fs';
import { UPLOAD_DIR } from '../../config/storage';

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
const storage: StorageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_DIR);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    },
});

const upload: Multer = multer({ storage });

export class PostRouter {
    public meRouter: Router;
    public publicRouter: Router;
    public anotherUserRouter: Router;

    constructor(private postsController: PostController) {
        this.meRouter = Router({ mergeParams: true });
        this.anotherUserRouter = Router({ mergeParams: true });
        this.publicRouter = Router();
        this.initializeMeRoutes();
        this.initializePublicRoutes();
        this.initializeAnotherUserRoutes();
    }

    private initializeMeRoutes() {
        this.meRouter.post(
            '/',
            upload.single('image'),
            this.postsController.createPostHandler,
        );
        this.meRouter.get('/', this.postsController.getAllPostsHandler);
        this.meRouter.get('/:id', this.postsController.getPostByIdHandler);
        this.meRouter.delete('/:id', this.postsController.deletePostHandler);
        this.meRouter.patch('/:id', this.postsController.updatePostHandler);
    }

    private initializePublicRoutes() {
        this.publicRouter.get('/', this.postsController.getAllPostsHandler);
        this.publicRouter.get('/:id', this.postsController.getPostByIdHandler);
    }

    private initializeAnotherUserRoutes() {
        this.anotherUserRouter.get(
            '/',
            this.postsController.getAllPostsHandler,
        );
        this.anotherUserRouter.get(
            '/:id',
            this.postsController.getPostByIdHandler,
        );
    }
}
