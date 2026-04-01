import { NextFunction, Request, Response } from 'express';
import { Post } from '../../domain/posts/post';
import { PostAssembler } from './assembler/post.assembler';
import { ResponsePostDTO } from './dto/response-post.dto';
import { PostFieldsDto } from './dto/post-fields.dto';
import { CreatePostUsecase } from '../../application/posts/create-post.usecase';
import { GetAllPostsUsecase } from '../../application/posts/get-all-posts.usecase';
import { GetPostByIdUsecase } from '../../application/posts/get-post-by-id.usecase';
import { UpdatePostUsecase } from '../../application/posts/update-post.usecase';
import { DeletePostUsecase } from '../../application/posts/delete-post.usecase';
import { PostFieldsValidator } from './assembler/post-fields-validator';
import { SearchPostsByDescriptionUsecase } from '../../application/posts/search-posts-by-description.usecase';
import { SearchPostsByHashtagUsecase } from '../../application/posts/search-posts-by-hashtag.usecase';
import { logger } from '../../logger';
import { CommentPostUseCase } from '../../application/posts/comment-post.usecase';
import { LikePostUseCase } from '../../application/posts/like-post.usecase';
import { CommentDto } from './dto/comment.dto';
import { PostLike } from '../../domain/posts/post-like';
import { PostComment } from '../../domain/posts/post-comment';
import { GetPopularHashtagsUsecase } from '../../application/posts/get-popular-hashtags.usecase';

export class PostController {
    constructor(
        private readonly createPost: CreatePostUsecase,
        private readonly getAllPosts: GetAllPostsUsecase,
        private readonly getPostById: GetPostByIdUsecase,
        private readonly updatePost: UpdatePostUsecase,
        private readonly deletePost: DeletePostUsecase,
        private readonly searchPostsByDescription: SearchPostsByDescriptionUsecase,
        private readonly searchPostsByHashtag: SearchPostsByHashtagUsecase,
        private readonly commentPost: CommentPostUseCase,
        private readonly likePost: LikePostUseCase,
        private readonly getPopularHashtagsUsecase: GetPopularHashtagsUsecase,
        private postAssembler: PostAssembler,
    ) {}
    createPostHandler = async (
        req: Request<{}, {}, PostFieldsDto>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const post: Post = this.postAssembler.toPost(req, req.userId!);

            await this.createPost.execute(post);

            const postDTO: ResponsePostDTO = this.postAssembler.toPostDTO(
                post,
                req.userId,
            );
            req.userLogger.info('Post created', { postId: post.id });
            return res.status(201).json(postDTO);
        } catch (error: any) {
            req.userLogger.error('Failed to create post', {
                error: error.message,
            });
            next(error);
        }
    };

    getAllPostsHandler = async (
        req: Request<{ userId?: string }>,
        res: Response,
    ) => {
        const { q, hashtag, exactMatch } = req.query as {
            q?: string;
            hashtag?: string;
            exactMatch?: string;
        };
        const { userId: userIdParam } = req.params;
        const userId: string | undefined =
            userIdParam === 'me' ? req.userId : userIdParam;

        let posts: Post[];
        if (hashtag && !userId) {
            posts =
                exactMatch === 'true'
                    ? await this.searchPostsByHashtag.executeExact(hashtag)
                    : await this.searchPostsByHashtag.execute(hashtag);
        } else if (q && !userId) {
            posts = await this.searchPostsByDescription.execute(q);
        } else if (userId) {
            posts = await this.getAllPosts.executeForUser(userId);
        } else {
            posts = await this.getAllPosts.execute();
        }

        req.userLogger.debug('Posts fetched', {
            count: posts.length,
            targetId: userId,
        });

        const postsDTO: ResponsePostDTO[] = posts.map(
            (post: Post): ResponsePostDTO =>
                this.postAssembler.toPostDTO(post, req.userId),
        );
        return res.status(200).json(postsDTO);
    };

    getPostByIdHandler = async (
        req: Request<{ id: string; userId?: string }>,
        res: Response,
        next: NextFunction,
    ) => {
        const { id: postId, userId: userIdParam } = req.params;

        const ownerUserId: string | undefined =
            userIdParam === 'me' ? req.userId : undefined;

        try {
            const post: Post = await this.getPostById.execute(
                postId,
                ownerUserId,
            );
            const responsePostDTO: ResponsePostDTO =
                this.postAssembler.toPostDTO(post, req.userId);
            logger.debug('Post fetched', { postId });
            return res.status(200).json(responsePostDTO);
        } catch (error: any) {
            logger.warn('Post not found', { postId });
            next(error);
        }
    };

    updatePostHandler = async (
        req: Request<
            { id: string; userId: string },
            {},
            Partial<PostFieldsDto>
        >,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const postId: string = req.params.id;
            const userId: string = req.userId;
            const validatedFields: Partial<PostFieldsDto> =
                PostFieldsValidator.validatePostFields(req.body);

            const post: Post = await this.updatePost.execute(
                postId,
                userId,
                validatedFields,
            );
            const responsePostDTO: ResponsePostDTO =
                this.postAssembler.toPostDTO(post, req.userId);
            req.userLogger.info('Post updated', { postId });
            return res.status(200).json(responsePostDTO);
        } catch (error: any) {
            req.userLogger.error('Failed to update post', {
                error: error.message,
                postId: req.params.id,
            });
            next(error);
        }
    };

    deletePostHandler = async (
        req: Request<{ id: string }>,
        res: Response,
        next: NextFunction,
    ) => {
        const postId: string = req.params.id;
        try {
            await this.deletePost.execute(postId, req.userId!);
            req.userLogger.info('Post deleted', { postId });
            return res.status(204).send();
        } catch (error: any) {
            req.userLogger.error('Failed to delete post', {
                error: error.message,
                postId,
            });
            next(error);
        }
    };

    likePostHandler = async (
        req: Request<{ id: string }>,
        res: Response,
        next: NextFunction,
    ) => {
        const postId: string = req.params.id;
        const userId: string = req.userId;
        try {
            const like: PostLike = this.postAssembler.toLike(userId);
            const post: Post = await this.likePost.execute(
                postId,
                like,
                userId,
            );
            const likeId: string = like.id;
            const responsePostDTO: ResponsePostDTO =
                this.postAssembler.toPostDTO(post, userId);
            req.userLogger.info('Post Liked', { postId, likeId });
            res.status(200).json(responsePostDTO);
        } catch (error: any) {
            req.userLogger.error('Failed to like post', {
                error: error.message,
                postId,
            });
            next(error);
        }
    };

    commentPostHandler = async (
        req: Request<{ id: string }, {}, CommentDto>,
        res: Response,
        next: NextFunction,
    ) => {
        const postId: string = req.params.id;
        const userId: string = req.userId;
        try {
            const postComment: PostComment = this.postAssembler.toComment(
                req.body,
                userId,
            );
            const commentId: string = postComment.id;
            const post: Post = await this.commentPost.execute(
                postId,
                postComment,
                userId,
            );
            const responsePostDTO: ResponsePostDTO =
                this.postAssembler.toPostDTO(post, userId);
            req.userLogger.info('Post commented', { postId, commentId });
            res.status(200).json(responsePostDTO);
        } catch (error: any) {
            req.userLogger.error('Failed to comment post', {
                error: error.message,
                postId,
            });
            next(error);
        }
    };

    deleteLikePostHandler = async (
        req: Request<{ id: string }, {}, {}>,
        res: Response,
        next: NextFunction,
    ) => {
        const { id: postId } = req.params;
        try {
            const userId: string = req.userId;
            const post: Post = await this.likePost.executeDelete(
                postId,
                userId,
            );
            const responsePostDTO: ResponsePostDTO =
                this.postAssembler.toPostDTO(post, userId);
            req.userLogger.info('Post unliked', { postId });
            res.status(200).json(responsePostDTO);
        } catch (error: any) {
            req.userLogger.error('Failed to unlike post', {
                error: error.message,
                postId,
            });
            next(error);
        }
    };

    deleteCommentPostHandler = async (
        req: Request<{ id: string; commentId: string }, {}, {}>,
        res: Response,
        next: NextFunction,
    ) => {
        const { id: postId, commentId } = req.params;
        try {
            const userId: string = req.userId;
            const post: Post = await this.commentPost.executeDelete(
                postId,
                commentId,
                userId,
            );
            const responsePostDTO: ResponsePostDTO =
                this.postAssembler.toPostDTO(post, userId);
            req.userLogger.info('Post uncommented', { postId, commentId });
            res.status(200).json(responsePostDTO);
        } catch (error: any) {
            req.userLogger.error('Failed to delete post', {
                error: error.message,
                postId,
            });
            next(error);
        }
    };

    getPopularHashtags = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const rawLimit = req.query.limit;
            const limit = rawLimit ? Number(rawLimit) : 10;

            if (rawLimit && Number.isNaN(limit)) {
                req.userLogger.warn('Invalid limit parameter', { rawLimit });
                return res
                    .status(400)
                    .json({ message: 'Invalid limit parameter' });
            }

            const hashtags =
                await this.getPopularHashtagsUsecase.execute(limit);

            req.userLogger.info('Popular hashtags fetched', {
                count: hashtags.length,
                limit,
            });

            return res.status(200).json(hashtags);
        } catch (error) {
            req.userLogger.error('Failed to fetch popular hashtags', { error });
            next(error);
        }
    };
}
