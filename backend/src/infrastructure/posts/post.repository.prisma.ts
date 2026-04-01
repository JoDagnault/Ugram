import { PrismaClient } from '../../generated/prisma';
import { PostRepository } from '../../domain/posts/post.repository';
import { Post } from '../../domain/posts/post';
import { NotFoundError } from '../../errors/not-found.error';
import { PostComment } from '../../domain/posts/post-comment';
import { PostLike } from '../../domain/posts/post-like';
import { HashtagStats } from '../../domain/posts/hashtag-stats';

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
                likes: {
                    create: [],
                },
                comments: {
                    create: [],
                },
                createdAt: new Date(post.createdAt),
            },
        });
    }

    async findAll(): Promise<Post[]> {
        const posts = await this.prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                hashtags: true,
                mentions: true,
                likes: true,
                comments: true,
            },
        });

        return posts.map((p) => this.toDomain(p));
    }

    async findById(id: string): Promise<Post> {
        const p = await this.prisma.post.findUnique({
            where: { id },
            include: {
                hashtags: true,
                mentions: true,
                likes: true,
                comments: true,
            },
        });
        if (!p) throw new NotFoundError('Post not found');
        return this.toDomain(p);
    }

    async findByUserId(userId: string): Promise<Post[]> {
        const posts = await this.prisma.post.findMany({
            where: { authorId: userId },
            orderBy: { createdAt: 'desc' },
            include: {
                hashtags: true,
                mentions: true,
                likes: true,
                comments: true,
            },
        });

        return posts.map((p) => this.toDomain(p));
    }

    async findByExactHashtag(hashtag: string): Promise<Post[]> {
        const posts = await this.prisma.post.findMany({
            where: {
                hashtags: {
                    some: {
                        name: {
                            equals: hashtag,
                        },
                    },
                },
            },
            include: {
                hashtags: true,
                mentions: true,
                likes: true,
                comments: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return posts.map((p) => this.toDomain(p));
    }

    async findByMatchingHashtag(query: string): Promise<Post[]> {
        const posts = await this.prisma.post.findMany({
            where: {
                hashtags: {
                    some: {
                        name: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                },
            },
            include: {
                hashtags: true,
                mentions: true,
                likes: true,
                comments: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return posts.map((p) => this.toDomain(p));
    }

    async findByDescription(query: string): Promise<Post[]> {
        const posts = await this.prisma.post.findMany({
            where: {
                description: {
                    contains: query,
                    mode: 'insensitive',
                },
            },
            include: {
                hashtags: true,
                mentions: true,
                likes: true,
                comments: true,
            },
            orderBy: { createdAt: 'desc' },
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
            include: {
                hashtags: true,
                mentions: true,
                likes: true,
                comments: true,
            },
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

    private toDomain(p: any): Post {
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
        );
    }
}
