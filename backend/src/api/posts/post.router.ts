import { Router } from 'express';
import fs from 'fs';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import { PostController } from './post.controller';
import { config } from '../../config/config';
import { s3 } from '../../config/s3';
import { UPLOAD_DIR } from '../../config/storage';
import { BadRequestError } from '../../errors/bad-request.error';

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const upload = multer({
    limits: {
        fileSize: config.uploads.MAX_IMAGE_SIZE_BYTES,
    },
    fileFilter: (_req, file, cb) => {
        const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
        if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new BadRequestError(
                    `Invalid file type. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`,
                ),
            );
        }
    },
    storage: multerS3({
        s3,
        bucket: config.aws.BUCKET_NAME,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (_req, file, cb) => {
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
        this.meRouter.patch(
            '/:id/comment',
            this.postsController.commentPostHandler,
        );
        this.meRouter.patch('/:id/like', this.postsController.likePostHandler);
        this.meRouter.delete(
            '/:id/comment/:commentId',
            this.postsController.deleteCommentPostHandler,
        );
        this.meRouter.delete(
            '/:id/like',
            this.postsController.deleteLikePostHandler,
        );
    }

    private initializePublicRoutes() {
        this.publicRouter.get('/', this.postsController.getAllPostsHandler);
        this.publicRouter.get(
            '/hashtags/popular',
            this.postsController.getPopularHashtags,
        );
        this.publicRouter.get(
            '/hashtags/search',
            this.postsController.searchHashtagsByQuery,
        );
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
