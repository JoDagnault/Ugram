import { PrismaClient } from '../../generated/prisma';
import { PostRepository } from '../../domain/posts/post.repository';
import { Post } from '../../domain/posts/post';
import { NotFoundError } from '../../errors/not-found.error';
import { PostComment } from '../../domain/posts/post-comment';
import { PostLike } from '../../domain/posts/post-like';
import { HashtagStats } from '../../domain/posts/hashtag-stats';

const BASE_INCLUDE = {
    hashtags: true,
    mentions: true,
    likes: true,
    comments: true,
};

export class PrismaPostRepository implements PostRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async save(post: Post): Promise<void> {
        await this.prisma.post.create({
            data: {
                id: post.id,
                authorId: post.userId,
                imageURL: post.imageURL,
                description: post.description,
                hashtags: {
                    create: post.hashtags.map((name) => ({ name })),
                },
                mentions: {
                    create: post.mentions.map((userId) => ({ userId })),
                },
                createdAt: new Date(post.createdAt),
            },
        });
    }

    async findAll({
        page,
        limit,
    }: {
        page: number;
        limit: number;
    }): Promise<Post[]> {
        const posts = await this.prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
            include: {
                hashtags: true,
                mentions: true,
                likes: true,
                comments: true,
            },
        });
        return posts.map((p) => this.toDomain(p));
    }

    async findById(id: string, requestingUserId?: string): Promise<Post> {
        const p = await this.prisma.post.findUnique({
            where: { id },
            include: BASE_INCLUDE,
        });
        if (!p) throw new NotFoundError('Post not found');
        return this.toDomain(p, requestingUserId);
    }

    async findByUserId(
        userId: string,
        { page, limit }: { page: number; limit: number },
    ): Promise<Post[]> {
        const posts = await this.prisma.post.findMany({
            where: { authorId: userId },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
            include: {
                hashtags: true,
                mentions: true,
                likes: true,
                comments: true,
            },
        });
        return posts.map((p) => this.toDomain(p));
    }

    async findByExactHashtag(
        hashtag: string,
        { page, limit }: { page: number; limit: number },
    ): Promise<Post[]> {
        const posts = await this.prisma.post.findMany({
            where: { hashtags: { some: { name: { equals: hashtag } } } },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
            include: {
                hashtags: true,
                mentions: true,
                likes: true,
                comments: true,
            },
        });
        return posts.map((p) => this.toDomain(p));
    }

    async findByMatchingHashtag(
        query: string,
        { page, limit }: { page: number; limit: number },
    ): Promise<Post[]> {
        const posts = await this.prisma.post.findMany({
            where: {
                hashtags: {
                    some: { name: { contains: query, mode: 'insensitive' } },
                },
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
            include: {
                hashtags: true,
                mentions: true,
                likes: true,
                comments: true,
            },
        });
        return posts.map((p) => this.toDomain(p));
    }

    async findByDescription(
        query: string,
        { page, limit }: { page: number; limit: number },
    ): Promise<Post[]> {
        const posts = await this.prisma.post.findMany({
            where: { description: { contains: query, mode: 'insensitive' } },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
            include: {
                hashtags: true,
                mentions: true,
                likes: true,
                comments: true,
            },
        });
        return posts.map((p) => this.toDomain(p));
    }

    async update(post: Post): Promise<Post> {
        const updated = await this.prisma.post.update({
            where: { id: post.id },
            data: {
                description: post.description,
                hashtags: {
                    deleteMany: {},
                    create: post.hashtags.map((name) => ({ name })),
                },
                mentions: {
                    deleteMany: {},
                    create: post.mentions.map((userId) => ({ userId })),
                },
                likes: {
                    deleteMany: {},
                    create: post.likes.map((like) => ({
                        id: like.id,
                        from: like.from,
                        createdAt: new Date(like.createdAt),
                    })),
                },
                comments: {
                    deleteMany: {},
                    create: post.comments.map((comment) => ({
                        id: comment.id,
                        from: comment.from,
                        comment: comment.comment,
                        createdAt: new Date(comment.createdAt),
                    })),
                },
            },
            include: BASE_INCLUDE,
        });
        return this.toDomain(updated);
    }

    async deleteById(id: string): Promise<void> {
        try {
            await this.prisma.post.delete({ where: { id } });
        } catch {
            throw new NotFoundError('Post not found');
        }
    }

    async getPopularHashtags(limit: number = 10): Promise<HashtagStats[]> {
        const result = await this.prisma.postHashtag.groupBy({
            by: ['name'],
            _count: { name: true },
            orderBy: { _count: { name: 'desc' } },
            take: limit,
        });
        return result.map((r) => new HashtagStats(r.name, r._count.name));
    }

    async searchHashtagsByQuery(
        query: string,
        limit: number = 20,
    ): Promise<HashtagStats[]> {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) return [];

        const result = await this.prisma.postHashtag.groupBy({
            by: ['name'],
            where: { name: { contains: normalizedQuery, mode: 'insensitive' } },
            _count: { name: true },
            orderBy: { _count: { name: 'desc' } },
            take: limit,
        });
        return result.map((r) => new HashtagStats(r.name, r._count.name));
    }

    async removeMentionsOfUser(userId: string): Promise<void> {
        await this.prisma.postMention.deleteMany({ where: { userId } });
    }

    async likePost(postId: string, userId: string): Promise<void> {
        await this.prisma.postLike.upsert({
            where: { postId_from: { postId, from: userId } },
            create: { id: crypto.randomUUID(), postId, from: userId },
            update: {},
        });
    }

    async unlikePost(postId: string, userId: string): Promise<void> {
        await this.prisma.postLike.deleteMany({ where: { postId, from: userId } });
    }

    async addComment(
        postId: string,
        userId: string,
        content: string,
    ): Promise<PostComment> {
        const c = await this.prisma.postComment.create({
            data: {
                id: crypto.randomUUID(),
                postId,
                from: userId,
                comment: content,
            },
        });
        return new PostComment(c.id, c.comment, c.from, c.createdAt.toISOString());
    }

    private toDomain(p: any, requestingUserId?: string): Post {
        return new Post(
            p.id,
            p.authorId,
            p.imageURL,
            p.description,
            p.hashtags.map((h: { name: string }) => h.name),
            p.mentions.map((m: { userId: string }) => m.userId),
            p.comments.map(
                (c: {
                    id: string;
                    comment: string;
                    from: string;
                    createdAt: Date;
                }) =>
                    new PostComment(
                        c.id,
                        c.comment,
                        c.from,
                        c.createdAt.toISOString(),
                    ),
            ),
            p.likes.map(
                (l: { id: string; from: string; createdAt: Date }) =>
                    new PostLike(l.id, l.from, l.createdAt.toISOString()),
            ),
            p.createdAt.toISOString(),
            p.likes.length,
            requestingUserId
                ? p.likes.some(
                      (l: { from: string }) => l.from === requestingUserId,
                  )
                : false,
        );
    }
}
