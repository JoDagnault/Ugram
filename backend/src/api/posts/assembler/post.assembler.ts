import { Request } from 'express';
import { PostFieldsDto } from '../dto/post-fields.dto';
import { Post } from '../../../domain/posts/post';
import { v4 as uuid } from 'uuid';
import { ResponsePostDTO } from '../dto/response-post.dto';

export class PostAssembler {
    toPost(req: Request<{}, {}, PostFieldsDto>, userId: string): Post {
        const file = req.file;
        if (!file) {
            throw new Error('No image uploaded');
        }

        const fields: PostFieldsDto = this.validatePostFields(req.body);

        const imageURL = `/uploads/${file.filename}`;
        const postId: string = uuid();

        return new Post(
            postId,
            userId,
            imageURL,
            fields.description || '',
            fields.hashtags || [],
            fields.mentions || [],
        );
    }

    toPostDTO(post: Post): ResponsePostDTO {
        return new ResponsePostDTO(
            post.id,
            post.userId,
            post.imageURL,
            post.description,
            Array.isArray(post.hashtags)
                ? post.hashtags
                : JSON.parse(post.hashtags),
            Array.isArray(post.mentions)
                ? post.mentions
                : JSON.parse(post.mentions),
            post.createdAt,
        );
    }

    validatePostFields(fields: PostFieldsDto): PostFieldsDto {
        const hashtags: string[] = this.parseStringArray(fields.hashtags);
        const mentions: string[] = this.parseStringArray(fields.mentions);

        let description = fields.description?.trim() || '';
        if (description.startsWith('"') && description.endsWith('"')) {
            description = description.slice(1, -1);
        }

        return {
            description: description,

            hashtags: hashtags.map((tag) =>
                tag.replace(/^#/, '').trim().toLowerCase(),
            ),

            mentions: mentions.map((m) => m.replace(/^@/, '').trim()),
        };
    }

    private parseStringArray(value: any): string[] {
        if (!value) return [];

        if (Array.isArray(value)) return value;

        if (typeof value === 'string') {
            try {
                const parsed = JSON.parse(value);
                if (!Array.isArray(parsed)) throw new Error();
                return parsed.filter((x) => typeof x === 'string');
            } catch {
                throw new Error('Must be an array of strings');
            }
        }

        throw new Error('Must be an array of strings');
    }
}
