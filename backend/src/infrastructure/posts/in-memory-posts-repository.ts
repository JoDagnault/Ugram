import { PostsRepository } from '../../domain/posts/posts.repository';
import { Post } from '../../domain/posts/post';

export class InMemoryPostsRepository implements PostsRepository {
    private posts: Post[] = [];

    async save(post: Post): Promise<void> {
        this.posts.push(post);
    }

    async findAll(): Promise<Post[]> {
        return [...this.posts].sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
        );
    }

    async findById(id: string): Promise<Post> {
        const post = this.posts.find((post) => post.id === id);
        if (!post) throw new Error('Post not found');
        return post;
    }

    async update(post: Post): Promise<Post> {
        const index = this.posts.findIndex((p) => p.id === post.id);
        if (index === -1) throw new Error('Post not found');
        this.posts[index] = post;
        return post;
    }

    async deleteById(id: string): Promise<void> {
        const index = this.posts.findIndex((post) => post.id === id);
        if (index === -1) throw new Error('Post not found');
        this.posts.splice(index, 1);
    }
}
