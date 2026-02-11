import { PostRepository } from '../../domain/posts/post.repository';
import { InMemoryPostsRepository } from '../../infrastructure/posts/post.repository.memory';
import { CreatePostUsecase } from '../../application/posts/create-post.usecase';
import { DeletePostUsecase } from '../../application/posts/delete-post.usecase';
import { GetAllPostsUsecase } from '../../application/posts/get-all-posts.usecase';
import { GetPostByIdUsecase } from '../../application/posts/get-post-by-id.usecase';
import { UpdatePostUsecase } from '../../application/posts/update-post.usecase';
import { PostAssembler } from './assembler/postAssembler';
import { PostController } from './post.controller';
import { PostRouter } from './post.router';

export function PostModule() {
    const postRepository: PostRepository = new InMemoryPostsRepository();

    const createPost: CreatePostUsecase = new CreatePostUsecase(postRepository);
    const deletePost: DeletePostUsecase = new DeletePostUsecase(postRepository);
    const getAllPosts: GetAllPostsUsecase = new GetAllPostsUsecase(
        postRepository,
    );
    const getPostById: GetPostByIdUsecase = new GetPostByIdUsecase(
        postRepository,
    );
    const updatePost: UpdatePostUsecase = new UpdatePostUsecase(postRepository);

    const assembler: PostAssembler = new PostAssembler();
    const controller: PostController = new PostController(
        createPost,
        getAllPosts,
        getPostById,
        updatePost,
        deletePost,
        assembler,
    );
    const router = new PostRouter(controller);

    return { router: router.router };
}
