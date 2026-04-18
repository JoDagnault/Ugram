/**
 * @openapi
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of posts
 *
 * /posts/hashtags/popular:
 *   get:
 *     summary: Get popular hashtags
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of popular hashtags
 *
 * /posts/hashtags/search:
 *   get:
 *     summary: Search hashtags
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Text used to match hashtag names.
 *         example: sun
 *     responses:
 *       200:
 *         description: Search results
 *
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique post ID.
 *     responses:
 *       200:
 *         description: Post found
 *       404:
 *         description: Post not found
 *
 * /users/me/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload. Valid types are JPEG, PNG, and WebP.
 *               description:
 *                 type: string
 *                 description: Caption shown with the post.
 *                 example: Photo taken at the park near sunset
 *               hashtags:
 *                 type: string
 *                 description: JSON stringified array of hashtags. Max 30 characters per hashtag.
 *                 example: "[\"nature\",\"sunset\"]"
 *               mentions:
 *                 type: string
 *                 description: JSON stringified array of mentioned user IDs. Every ID must refer to an existing user.
 *                 example: "[\"clx9abc123\",\"clx9def456\"]"
 *     responses:
 *       201:
 *         description: Post created
 *   get:
 *     summary: Get the authenticated user's posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of posts
 *
 * /users/me/posts/{id}:
 *   get:
 *     summary: Get one of the authenticated user's posts by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique post ID owned by the authenticated user.
 *     responses:
 *       200:
 *         description: Post found
 *       404:
 *         description: Post not found
 *   patch:
 *     summary: Update a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique post ID owned by the authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: New caption for the post. Maximum 300 characters.
 *                 example: Photo taken at the park near sunset
 *               hashtags:
 *                 type: array
 *                 description: New hashtag list. Use plain names without spaces.
 *                 items:
 *                   type: string
 *                 example: [nature, sunset]
 *               mentions:
 *                 type: array
 *                 description: New list of mentioned user IDs. All IDs must exist.
 *                 items:
 *                   type: string
 *                 example: [clx9abc123, clx9def456]
 *           examples:
 *             descriptionOnly:
 *               summary: Update only the description
 *               value:
 *                 description: Updated caption for the post
 *             hashtagsOnly:
 *               summary: Replace the hashtags
 *               value:
 *                 hashtags: [nature, sunset, voyage]
 *             mentionsAndHashtags:
 *               summary: Update mentions and hashtags together
 *               value:
 *                 description: Evening photo walk with friends
 *                 hashtags: [campus, sunset]
 *                 mentions: [clx9abc123, clx9def456]
 *     responses:
 *       200:
 *         description: Post updated
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique post ID owned by the authenticated user.
 *     responses:
 *       204:
 *         description: Post deleted
 *
 * /users/me/posts/{id}/comment:
 *   patch:
 *     summary: Add a comment to a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique post ID to comment on.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [comment]
 *             properties:
 *               comment:
 *                 type: string
 *                 description: Comment body. Must contain 1 to 400 characters.
 *                 example: Great photo, the lighting looks really good.
 *           examples:
 *             simpleComment:
 *               summary: Minimal valid payload
 *               value:
 *                 comment: Great photo.
 *             detailedComment:
 *               summary: More complete example
 *               value:
 *                 comment: Great photo, I really like the lighting and framing.
 *     responses:
 *       200:
 *         description: Comment added
 *
 * /users/me/posts/{id}/like:
 *   patch:
 *     summary: Like a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique post ID to like.
 *     responses:
 *       200:
 *         description: Post liked
 *   delete:
 *     summary: Remove a like from a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique post ID to unlike.
 *     responses:
 *       204:
 *         description: Like removed
 *
 * /users/me/posts/{id}/comment/{commentId}:
 *   delete:
 *     summary: Delete a comment from a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique post ID that contains the comment.
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique comment ID to delete.
 *     responses:
 *       204:
 *         description: Comment deleted
 *
 * /users/{userId}/posts:
 *   get:
 *     summary: Get another user's posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique user ID of the post owner.
 *     responses:
 *       200:
 *         description: List of posts
 *
 * /users/{userId}/posts/{id}:
 *   get:
 *     summary: Get a specific post from another user
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique user ID of the post owner.
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique post ID.
 *     responses:
 *       200:
 *         description: Post found
 *       404:
 *         description: Post not found
 */
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
