import { PostRepository } from '../../domain/posts/post.repository';
import { Post } from '../../domain/posts/post';
import { NotFoundError } from '../../errors/not-found.error';

export class InMemoryPostsRepository implements PostRepository {
    private posts: Post[] = [];

    async save(post: Post): Promise<void> {
        this.posts.push(post);
    }

    async findAll(): Promise<Post[]> {
        return [...this.posts].sort(
            (a: Post, b: Post): number =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
        );
    }

    async findById(id: string): Promise<Post> {
        const post: Post | undefined = this.posts.find(
            (post: Post) => post.id === id,
        );
        if (!post) throw new NotFoundError('Post not found');
        return post;
    }

    async update(post: Post): Promise<Post> {
        const index: number = this.posts.findIndex(
            (p: Post) => p.id === post.id,
        );
        if (index === -1) throw new NotFoundError('Post not found');
        this.posts[index] = post;
        return post;
    }

    async deleteById(id: string): Promise<void> {
        const index: number = this.posts.findIndex((post) => post.id === id);
        if (index === -1) throw new NotFoundError('Post not found');
        this.posts.splice(index, 1);
    }

    async findByUserId(userId: string): Promise<Post[]> {
        return [
            ...this.posts.filter(
                (post: Post): boolean => post.userId === userId,
            ),
        ].sort(
            (a: Post, b: Post): number =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
        );
    }

    async removeMentionsOfUser(userId: string): Promise<void> {
        this.posts = this.posts.map((post) => {
            if (post.userId === userId) return post;
            post.updateFields({
                mentions: post.mentions.filter((id) => id !== userId),
            });
            return post;
        });
    }
}
