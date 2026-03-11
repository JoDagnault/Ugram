import { Request } from 'express';
import { PostFieldsDto } from '../dto/post-fields.dto';
import { Post } from '../../../domain/posts/post';
import { v4 as uuid } from 'uuid';
import { ResponsePostDTO } from '../dto/response-post.dto';
import { PostFieldsValidator } from './post-fields-validator';
import { S3File } from '../../../types/s3-file';

export class PostAssembler {
    toPost(req: Request<{}, {}, PostFieldsDto>, userId: string): Post {
        const file = req.file as S3File;
        if (!file) {
            throw new Error('No image uploaded');
        }
        const imageURL: string = file.location;

        const fields: PostFieldsDto = PostFieldsValidator.validatePostFields(
            req.body,
        );

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
