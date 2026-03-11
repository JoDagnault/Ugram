import { Router } from 'express';
import { PostController } from './post.controller';
import fs from 'fs';
import { UPLOAD_DIR } from '../../config/storage';
import { s3 } from '../../config/s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';

const MAX_IMAGE_SIZE_BYTES = Number(
    process.env.MAX_IMAGE_SIZE_BYTES ?? 10 * 1024 * 1024,
);

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const bucketName: string | undefined = process.env.AWS_BUCKET_NAME;

if (!bucketName) {
    throw new Error(
        'AWS_BUCKET_NAME must be defined in your environment variables',
    );
}

export const upload = multer({
    limits: {
        fileSize: MAX_IMAGE_SIZE_BYTES,
    },
    storage: multerS3({
        s3: s3,
        bucket: bucketName,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `posts/${Date.now()}-${file.fieldname}${ext}`);
        },
    }),
});

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
