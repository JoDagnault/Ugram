import { Request } from 'express';
import { PostFieldsDto } from '../dto/post-fields.dto';
import { Post } from '../../../domain/posts/post';
import { v4 as uuid } from 'uuid';
import { ResponsePostDTO } from '../dto/response-post.dto';
import { PostFieldsValidator } from './post-fields-validator';
import { S3File } from '../../../types/s3-file';
import { BadRequestError } from '../../../errors/bad-request.error';
import { LikeDto } from '../dto/like.dto';
import { CommentDto } from '../dto/comment.dto';
import { PostComment } from '../../../domain/posts/post-comment';
import { PostLike } from '../../../domain/posts/post-like';

export class PostAssembler {
    toPost(req: Request<{}, {}, PostFieldsDto>, userId: string): Post {
        const file = req.file as S3File;
        if (!file) {
            throw new BadRequestError('No image uploaded');
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
            [],
            [],
        );
    }

    toComment(commentDTO: CommentDto, userId: string): PostComment {
        PostFieldsValidator.validateComment(commentDTO.comment);
        return new PostComment(uuid(), commentDTO.comment, userId);
    }

    toLike(userId: string): PostLike {
        return new PostLike(uuid(), userId);
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
            post.likes.map((l) => new LikeDto(l.from, l.createdAt)),
            post.comments.map(
                (c) => new CommentDto(c.comment, c.from, c.createdAt, c.id),
            ),
            post.createdAt,
            !!currentUserId && post.userId === currentUserId,
            !!currentUserId && post.likes.some((l) => l.from === currentUserId),
        );
    }
}
