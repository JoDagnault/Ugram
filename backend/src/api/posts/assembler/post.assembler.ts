import { Request } from 'express';
import { PostFieldsDto } from '../dto/post-fields.dto';
import { Post } from '../../../domain/posts/post';
import { v4 as uuid } from 'uuid';
import { ResponsePostDTO } from '../dto/response-post.dto';
import { PostFieldsValidator } from './post-fields-validator';

export class PostAssembler {
    toPost(req: Request<{}, {}, PostFieldsDto>, userId: string): Post {
        const file = req.file;
        if (!file) {
            throw new Error('No image uploaded');
        }

        const fields: PostFieldsDto = PostFieldsValidator.validatePostFields(
            req.body,
        );

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

    toPostDTO(post: Post, currentUserId?: string): ResponsePostDTO {
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
            !!currentUserId && post.userId === currentUserId,
        );
    }
}
