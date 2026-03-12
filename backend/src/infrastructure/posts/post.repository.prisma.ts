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
                hashtags: post.hashtags,
                mentions: post.mentions,
                createdAt: new Date(post.createdAt),
            },
        });
    }

    async findAll(): Promise<Post[]> {
        const posts = await this.prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return posts.map((p) => this.toDomain(p));
    }

    async findById(id: string): Promise<Post> {
        const p = await this.prisma.post.findUnique({ where: { id } });
        if (!p) throw new NotFoundError('Post not found');
        return this.toDomain(p);
    }

    async findByUserId(userId: string): Promise<Post[]> {
        const posts = await this.prisma.post.findMany({
            where: { authorId: userId },
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
            orderBy: { createdAt: 'desc' },
        });

        return posts.map((p) => this.toDomain(p));
    }

    async update(post: Post): Promise<Post> {
        const updated = await this.prisma.post.update({
            where: { id: post.id },
            data: {
                description: post.description,
                hashtags: post.hashtags,
                mentions: post.mentions,
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

    private toDomain(p: any): Post {
        return new Post(
            p.id,
            p.authorId,
            p.imageURL,
            p.description,
            p.hashtags ?? [],
            p.mentions ?? [],
            p.createdAt.toISOString(),
        );
    }
}
