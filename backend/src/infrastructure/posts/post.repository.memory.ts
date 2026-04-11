import { PostRepository } from '../../domain/posts/post.repository';
import { Post } from '../../domain/posts/post';
import { PostComment } from '../../domain/posts/post-comment';
import { PostLike } from '../../domain/posts/post-like';
import { NotFoundError } from '../../errors/not-found.error';
import { HashtagStats } from '../../domain/posts/hashtag-stats';

export class InMemoryPostsRepository implements PostRepository {
    private posts: Post[] = [];
    private likes = new Map<string, Set<string>>();
    private comments = new Map<string, PostComment[]>();

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

    async findById(id: string, requestingUserId?: string): Promise<Post> {
        const post: Post | undefined = this.posts.find(
            (post: Post) => post.id === id,
        );
        if (!post) throw new NotFoundError('Post not found');

        const likers = this.likes.get(id) ?? new Set();
        const comments = this.comments.get(id) ?? [];

        return new Post(
            post.id,
            post.userId,
            post.imageURL,
            post.description,
            post.hashtags,
            post.mentions,
            comments,
            post.likes,
            post.createdAt,
            requestingUserId ? likers.has(requestingUserId) : false,
        );
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

    async getPopularHashtags(limit: number = 10): Promise<HashtagStats[]> {
        const counts: Record<string, number> = {};
        for (const post of this.posts) {
            for (const hashtag of post.hashtags) {
                counts[hashtag] = (counts[hashtag] || 0) + 1;
            }
        }
        return Object.entries(counts)
            .map(([name, count]) => new HashtagStats(name, count))
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

    async likePost(postId: string, userId: string): Promise<void> {
        const likers = this.likes.get(postId) ?? new Set<string>();
        if (likers.has(userId)) return;
        likers.add(userId);
        this.likes.set(postId, likers);
    }

    async unlikePost(postId: string, userId: string): Promise<void> {
        this.likes.get(postId)?.delete(userId);
    }

    async addComment(
        postId: string,
        userId: string,
        content: string,
    ): Promise<PostComment> {
        const comment = new PostComment(
            crypto.randomUUID(),
            content,
            userId,
            new Date().toISOString(),
        );
        const existing = this.comments.get(postId) ?? [];
        this.comments.set(postId, [...existing, comment]);
        return comment;
    }
}
