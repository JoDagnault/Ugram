import { Request, Response } from 'express';
import { Post } from '../../domain/posts/post';
import { PostAssembler } from './assembler/postAssembler';
import { ResponsePostDTO } from './dto/response-post.dto';
import { PostFieldsDto } from './dto/post-fields.dto';
import { CreatePostUsecase } from '../../application/posts/create-post.usecase';
import { GetAllPostsUsecase } from '../../application/posts/get-all-posts.usecase';
import { GetPostByIdUsecase } from '../../application/posts/get-post-by-id.usecase';
import { UpdatePostUsecase } from '../../application/posts/update-post.usecase';
import { DeletePostUsecase } from '../../application/posts/delete-post.usecase';

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
    ) => {
        try {
            const post: Post = this.postAssembler.toPost(req);

            await this.createPost.execute(post);

            const postDTO: ResponsePostDTO = this.postAssembler.toPostDTO(post);
            return res.status(201).json(postDTO);
        } catch (err: any) {
            return res.status(400).json({
                message: err.message || 'Invalid request',
            });
        }
    };

    getAllPostsHandler = async (_req: Request, res: Response) => {
        const posts: Post[] = await this.getAllPosts.execute();
        const postsDTO: ResponsePostDTO[] = posts.map((post: Post) =>
            this.postAssembler.toPostDTO(post),
        );
        return res.status(200).json(postsDTO);
    };

    getPostByIdHandler = async (
        req: Request<{ id: string }>,
        res: Response,
    ) => {
        const { id } = req.params;
        try {
            const post: Post = await this.getPostById.execute(id);
            const responsePostDTO: ResponsePostDTO =
                this.postAssembler.toPostDTO(post);
            return res.status(200).json(responsePostDTO);
        } catch {
            return res.status(404).json({ message: 'Post not found' });
        }
    };

    updatePostHandler = async (
        req: Request<{ id: string }, {}, Partial<PostFieldsDto>>,
        res: Response,
    ) => {
        const { id } = req.params;
        const fieldsToUpdate: Partial<PostFieldsDto> = req.body;

        try {
            const post: Post = await this.updatePost.execute(
                id,
                fieldsToUpdate,
            );
            const responsePostDTO: ResponsePostDTO =
                this.postAssembler.toPostDTO(post);
            return res.status(200).json(responsePostDTO);
        } catch {
            return res.status(404).json({ message: 'Post not found' });
        }
    };

    deletePostHandler = async (req: Request<{ id: string }>, res: Response) => {
        const { id } = req.params;
        try {
            await this.deletePost.execute(id);
            return res.status(204).send();
        } catch {
            return res.status(404).json({ message: 'Post not found' });
        }
    };
}
