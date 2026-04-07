import { PostRepository } from '../../domain/posts/post.repository';
import { Post } from '../../domain/posts/post';
import { NotFoundError } from '../../errors/not-found.error';

export class InMemoryPostsRepository implements PostRepository {
    private posts: Post[] = [];

    async save(post: Post): Promise<void> {
        this.posts.push(post);
    }

    async findAll({
        page,
        limit,
    }: {
        page: number;
        limit: number;
    }): Promise<Post[]> {
        const sorted = [...this.posts].sort(
            (a: Post, b: Post): number =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
        );

        const start = (page - 1) * limit;
        return sorted.slice(start, start + limit);
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

    async findByUserId(
        userId: string,
        { page, limit }: { page: number; limit: number },
    ): Promise<Post[]> {
        const start = (page - 1) * limit;
        return [...this.posts.filter((post: Post) => post.userId === userId)]
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
            )
            .slice(start, start + limit);
    }

    async findByExactHashtag(
        hashtag: string,
        { page, limit }: { page: number; limit: number },
    ): Promise<Post[]> {
        const start = (page - 1) * limit;
        return [
            ...this.posts.filter((post) =>
                post.hashtags.some(
                    (tag) => tag.toLowerCase() === hashtag.toLowerCase(),
                ),
            ),
        ]
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
            )
            .slice(start, start + limit);
    }

    async findByMatchingHashtag(
        matchingHashtag: string,
        { page, limit }: { page: number; limit: number },
    ): Promise<Post[]> {
        const normalized = matchingHashtag.toLowerCase();
        const start = (page - 1) * limit;
        return [
            ...this.posts.filter((post) =>
                post.hashtags.some((tag) =>
                    tag.toLowerCase().includes(normalized),
                ),
            ),
        ]
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
            )
            .slice(start, start + limit);
    }

    async findByDescription(
        query: string,
        { page, limit }: { page: number; limit: number },
    ): Promise<Post[]> {
        const normalized = query.toLowerCase();
        const start = (page - 1) * limit;
        return [
            ...this.posts.filter((post) =>
                post.description.toLowerCase().includes(normalized),
            ),
        ]
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
            )
            .slice(start, start + limit);
    }
    async getPopularHashtags(
        limit: number = 10,
    ): Promise<{ name: string; count: number }[]> {
        const counts: Record<string, number> = {};
        for (const post of this.posts) {
            for (const hashtag of post.hashtags) {
                counts[hashtag] = (counts[hashtag] || 0) + 1;
            }
        }
        return Object.entries(counts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }

    async searchHashtagsByQuery(
        query: string,
        limit: number = 20,
    ): Promise<{ name: string; count: number }[]> {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) return [];

        const counts: Record<string, number> = {};
        for (const post of this.posts) {
            for (const hashtag of post.hashtags) {
                const normalizedHashtag = hashtag.toLowerCase();
                if (normalizedHashtag.includes(normalizedQuery)) {
                    counts[normalizedHashtag] =
                        (counts[normalizedHashtag] || 0) + 1;
                }
            }
        }
        return Object.entries(counts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
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
