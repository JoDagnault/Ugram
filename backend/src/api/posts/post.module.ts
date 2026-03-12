import { InMemoryPostsRepository } from '../../infrastructure/posts/post.repository.memory';
import { CreatePostUsecase } from '../../application/posts/create-post.usecase';
import { DeletePostUsecase } from '../../application/posts/delete-post.usecase';
import { GetAllPostsUsecase } from '../../application/posts/get-all-posts.usecase';
import { GetPostByIdUsecase } from '../../application/posts/get-post-by-id.usecase';
import { UpdatePostUsecase } from '../../application/posts/update-post.usecase';
import { PostAssembler } from './assembler/post.assembler';
import { PostController } from './post.controller';
import { PostRouter } from './post.router';
import { PrismaPostRepository } from '../../infrastructure/posts/post.repository.prisma';
import { getPrismaClient } from '../../infrastructure/prisma/client';
import { SearchPostsByDescriptionUsecase } from '../../application/posts/search-posts-by-description.usecase';

export function PostModule() {
    const env = process.env.NODE_ENV ?? 'development';
    const useInMemory = env === 'development' || env === 'test';

    const postRepository = useInMemory
        ? new InMemoryPostsRepository()
        : new PrismaPostRepository(getPrismaClient());

    const createPost: CreatePostUsecase = new CreatePostUsecase(postRepository);
    const deletePost: DeletePostUsecase = new DeletePostUsecase(postRepository);
    const getAllPosts: GetAllPostsUsecase = new GetAllPostsUsecase(
        postRepository,
    );
    const getPostById: GetPostByIdUsecase = new GetPostByIdUsecase(
        postRepository,
    );
    const updatePost: UpdatePostUsecase = new UpdatePostUsecase(postRepository);
    const searchPostsByDescription: SearchPostsByDescriptionUsecase =
        new SearchPostsByDescriptionUsecase(postRepository);

    const assembler: PostAssembler = new PostAssembler();
    const controller: PostController = new PostController(
        createPost,
        getAllPosts,
        getPostById,
        updatePost,
        deletePost,
        searchPostsByDescription,
        assembler,
    );
    const routers = new PostRouter(controller);

    return {
        publicRouter: routers.publicRouter,
        meRouter: routers.meRouter,
        anotherUserRouter: routers.anotherUserRouter,
    };
}
