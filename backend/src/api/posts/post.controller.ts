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

export class PostController {
    constructor(
        private readonly createPost: CreatePostUsecase,
        private readonly getAllPosts: GetAllPostsUsecase,
        private readonly getPostById: GetPostByIdUsecase,
        private readonly updatePost: UpdatePostUsecase,
        private readonly deletePost: DeletePostUsecase,
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
            return res.status(201).json(postDTO);
        } catch (error: any) {
            next(error);
        }
    };

    getAllPostsHandler = async (
        req: Request<{ userId?: string }>,
        res: Response,
    ) => {
        const { userId: userIdParam } = req.params;
        const userId: string | undefined =
            userIdParam === 'me' ? req.userId : userIdParam;

        const posts: Post[] = userId
            ? await this.getAllPosts.executeForUser(userId)
            : await this.getAllPosts.execute();

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

        // Only enforce ownership when accessing through the "me" route.
        // Other routes (e.g. GET /posts/:id or GET /users/:userId/posts/:id) are read-only and public.
        const ownerUserId: string | undefined =
            userIdParam === 'me' ? req.userId : undefined;

        try {
            const post: Post = await this.getPostById.execute(
                postId,
                ownerUserId,
            );
            const responsePostDTO: ResponsePostDTO =
                this.postAssembler.toPostDTO(post, req.userId);
            return res.status(200).json(responsePostDTO);
        } catch (error: any) {
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
            return res.status(200).json(responsePostDTO);
        } catch (error: any) {
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
            return res.status(204).send();
        } catch (error: any) {
            next(error);
        }
    };
}
