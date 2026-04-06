import { CreatePostUsecase } from '../../application/posts/create-post.usecase';
import { DeletePostUsecase } from '../../application/posts/delete-post.usecase';
import { GetAllPostsUsecase } from '../../application/posts/get-all-posts.usecase';
import { GetPostByIdUsecase } from '../../application/posts/get-post-by-id.usecase';
import { UpdatePostUsecase } from '../../application/posts/update-post.usecase';
import { PostAssembler } from './assembler/post.assembler';
import { PostController } from './post.controller';
import { PostRouter } from './post.router';
import { SearchPostsByDescriptionUsecase } from '../../application/posts/search-posts-by-description.usecase';
import { SearchPostsByHashtagUsecase } from '../../application/posts/search-posts-by-hashtag.usecase';
import { CommentPostUseCase } from '../../application/posts/comment-post.usecase';
import { LikePostUseCase } from '../../application/posts/like-post.usecase';
import { PostRepository } from '../../domain/posts/post.repository';
import { GetPopularHashtagsUsecase } from '../../application/posts/get-popular-hashtags.usecase';
import { UserRepository } from '../../domain/users/user.repository';

export function PostModule(
    postRepository: PostRepository,
    userRepository: UserRepository,
) {
    const createPost: CreatePostUsecase = new CreatePostUsecase(
        postRepository,
        userRepository,
    );
    const deletePost: DeletePostUsecase = new DeletePostUsecase(postRepository);
    const getAllPosts: GetAllPostsUsecase = new GetAllPostsUsecase(
        postRepository,
    );
    const getPostById: GetPostByIdUsecase = new GetPostByIdUsecase(
        postRepository,
    );
    const updatePost: UpdatePostUsecase = new UpdatePostUsecase(
        postRepository,
        userRepository,
    );
    const searchPostsByDescription: SearchPostsByDescriptionUsecase =
        new SearchPostsByDescriptionUsecase(postRepository);
    const searchPostsByHashtag: SearchPostsByHashtagUsecase =
        new SearchPostsByHashtagUsecase(postRepository);
    const commentPost: CommentPostUseCase = new CommentPostUseCase(
        postRepository,
    );
    const likePost: LikePostUseCase = new LikePostUseCase(postRepository);

    const assembler: PostAssembler = new PostAssembler();
    const getPopularHashtagsUsecase = new GetPopularHashtagsUsecase(
        postRepository,
    );
    const controller: PostController = new PostController(
        createPost,
        getAllPosts,
        getPostById,
        updatePost,
        deletePost,
        searchPostsByDescription,
        searchPostsByHashtag,
        commentPost,
        likePost,
        getPopularHashtagsUsecase,
        assembler,
    );
    const routers = new PostRouter(controller);

    return {
        publicRouter: routers.publicRouter,
        meRouter: routers.meRouter,
        anotherUserRouter: routers.anotherUserRouter,
    };
}
