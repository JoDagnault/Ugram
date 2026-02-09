import { Request, Response } from 'express';
import { PostsService } from '../../application/posts/posts.service';
import { Post } from '../../domain/posts/post';
import { PostsAssembler } from './assembler/posts.assembler';
import { ResponsePostDTO } from './dto/response-post.dto';
import { PostFieldsDto } from './dto/post-fields.dto';

export class PostsController {
    constructor(
        private postService: PostsService,
        private postAssembler: PostsAssembler,
    ) {}
    createPost = async (req: Request<{}, {}, PostFieldsDto>, res: Response) => {
        try {
            const post = this.postAssembler.toPost(req);

            await this.postService.create(post);

            const postDTO: ResponsePostDTO = this.postAssembler.toPostDTO(post);
            return res.status(201).json(postDTO);
        } catch (err: any) {
            return res.status(400).json({
                message: err.message || 'Invalid request',
            });
        }
    };

    getAllPosts = async (_req: Request, res: Response) => {
        const posts: Post[] = await this.postService.getAll();
        const postsDTO: ResponsePostDTO[] = posts.map((post: Post) =>
            this.postAssembler.toPostDTO(post),
        );
        return res.status(200).json(postsDTO);
    };

    getPostById = async (req: Request<{ id: string }>, res: Response) => {
        const { id } = req.params;
        try {
            const post: Post = await this.postService.getById(id);
            const responsePostDTO: ResponsePostDTO =
                this.postAssembler.toPostDTO(post);
            return res.status(200).json(responsePostDTO);
        } catch {
            return res.status(404).json({ message: 'Post not found' });
        }
    };

    update = async (
        req: Request<{ id: string }, {}, Partial<PostFieldsDto>>,
        res: Response,
    ) => {
        const { id } = req.params;
        const fieldsToUpdate: Partial<PostFieldsDto> = req.body;

        try {
            const post = await this.postService.update(id, fieldsToUpdate);
            const responsePostDTO: ResponsePostDTO =
                this.postAssembler.toPostDTO(post);
            return res.status(200).json(responsePostDTO);
        } catch {
            return res.status(404).json({ message: 'Post not found' });
        }
    };

    delete = async (req: Request<{ id: string }>, res: Response) => {
        const { id } = req.params;
        try {
            await this.postService.delete(id);
            return res.status(204).send();
        } catch {
            return res.status(404).json({ message: 'Post not found' });
        }
    };
}
