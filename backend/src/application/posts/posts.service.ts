import { Post } from '../../domain/posts/post';
import { PostsRepository } from '../../domain/posts/posts.repository';

export class PostsService {
    constructor(private readonly postsRepository: PostsRepository) {}
    async create(post: Post): Promise<void> {
        await this.postsRepository.save(post);
    }

    async getAll(): Promise<Post[]> {
        return await this.postsRepository.findAll();
    }

    async getById(id: string): Promise<Post> {
        return await this.postsRepository.findById(id);
    }

    async update(
        id: string,
        fields: {
            description?: string;
            hashtags?: string[];
            mentions?: string[];
        },
    ): Promise<Post> {
        const post = await this.postsRepository.findById(id);
        post.updateFields(fields);
        return await this.postsRepository.update(post);
    }

    async delete(id: string): Promise<void> {
        await this.postsRepository.deleteById(id);
    }
}
