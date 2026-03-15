import { PrismaClient } from '../../generated/prisma';
import { PostRepository } from '../../domain/posts/post.repository';
import { Post } from '../../domain/posts/post';
import { NotFoundError } from '../../errors/not-found.error';

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

    async findAll(): Promise<Post[]> {
        const posts = await this.prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            include: { hashtags: true, mentions: true },
        });

        return posts.map((p) => this.toDomain(p));
    }

    async findById(id: string): Promise<Post> {
        const p = await this.prisma.post.findUnique({
            where: { id },
            include: { hashtags: true, mentions: true },
        });
        if (!p) throw new NotFoundError('Post not found');
        return this.toDomain(p);
    }

    async findByUserId(userId: string): Promise<Post[]> {
        const posts = await this.prisma.post.findMany({
            where: { authorId: userId },
            orderBy: { createdAt: 'desc' },
            include: { hashtags: true, mentions: true },
        });

        return posts.map((p) => this.toDomain(p));
    }

    async findByExactHashtag(hashtag: string): Promise<Post[]> {
        const posts = await this.prisma.post.findMany({
            where: {
                hashtags: {
                    some: {
                        name: hashtag,
                    },
                },
            },
            include: { hashtags: true, mentions: true },
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
            include: { hashtags: true, mentions: true },
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
            include: { hashtags: true, mentions: true },
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
            },
            include: { hashtags: true, mentions: true },
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

    private toDomain(p: any): Post {
        return new Post(
            p.id,
            p.authorId,
            p.imageURL,
            p.description,
            p.hashtags?.map((h: any) => h.name) ?? [],
            p.mentions?.map((m: any) => m.userId) ?? [],
            p.createdAt.toISOString(),
        );
    }
}
