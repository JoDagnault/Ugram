import { z } from 'zod';
import { BadRequestError } from '../../../errors/bad-request.error';

const MAX_HASHTAG_LENGTH = 30;
const MAX_DESCRIPTION_LENGTH = 300;
const MAX_COMMENT_LENGTH = 400;

const HashtagSchema = z
    .string()
    .max(MAX_HASHTAG_LENGTH, `Hashtag exceeds ${MAX_HASHTAG_LENGTH} characters`)
    .regex(/^[a-zA-Z0-9_]+$/, 'Invalid hashtag format');

const MentionSchema = z
    .string()
    .regex(/^[a-zA-Z0-9._-]+$/, 'Invalid mention format');

const PostFieldsSchema = z.object({
    description: z
        .string()
        .max(
            MAX_DESCRIPTION_LENGTH,
            `Description exceeds ${MAX_DESCRIPTION_LENGTH} characters`,
        )
        .optional(),
    hashtags: z.array(HashtagSchema),
    mentions: z.array(MentionSchema),
});

const CommentSchema = z
    .string()
    .min(1, 'Comment must not be empty')
    .max(
        MAX_COMMENT_LENGTH,
        `Comment exceeds ${MAX_COMMENT_LENGTH} characters`,
    );

export class PostFieldsValidator {
    static validatePostFields(fields: any): z.infer<typeof PostFieldsSchema> {
        const hashtags = this.parseStringArray(fields.hashtags).map((tag) =>
            tag.replace(/^#/, '').trim().toLowerCase(),
        );
        const mentions = this.parseStringArray(fields.mentions).map((m) =>
            m.replace(/^@/, '').trim(),
        );

        let description = fields.description?.trim();
        if (description?.startsWith('"') && description?.endsWith('"')) {
            description = description.slice(1, -1);
        }

        const result = PostFieldsSchema.safeParse({
            description,
            hashtags,
            mentions,
        });
        if (!result.success) {
            throw new BadRequestError(result.error.issues[0].message);
        }

        for (const tag of hashtags) {
            const tagResult = HashtagSchema.safeParse(tag);
            if (!tagResult.success) {
                throw new BadRequestError(`Invalid hashtag: "${tag}"`);
            }
        }

        for (const mention of mentions) {
            const mentionResult = MentionSchema.safeParse(mention);
            if (!mentionResult.success) {
                throw new BadRequestError(`Invalid mention: "${mention}"`);
            }
        }

        return result.data;
    }

    private static parseStringArray(value: any): string[] {
        if (!value) return [];

        if (Array.isArray(value)) {
            return value.filter((x) => typeof x === 'string');
        }

        if (typeof value === 'string') {
            try {
                const parsed = JSON.parse(value);
                if (!Array.isArray(parsed)) {
                    throw new BadRequestError('Hashtags must be an array');
                }
                return parsed.filter((x) => typeof x === 'string');
            } catch {
                throw new BadRequestError('Must be an array of strings');
            }
        }

        throw new BadRequestError('Must be an array of strings');
    }

    private static validateHashtags(tags: string[]): void {
        const regex = /^[a-zA-Z0-9_]+$/;

        tags.forEach((tag) => {
            if (tag.length > MAX_HASHTAG_LENGTH) {
                throw new BadRequestError(
                    `Hashtag "${tag}" exceeds ${MAX_HASHTAG_LENGTH} characters`,
                );
            }

            if (!regex.test(tag)) {
                throw new BadRequestError(`Invalid hashtag: "${tag}"`);
            }
        });
    }

    private static validateMentions(mentions: string[]): void {
        const regex = /^[a-zA-Z0-9._-]+$/;

        mentions.forEach((m) => {
            if (!regex.test(m)) {
                throw new BadRequestError(`Invalid mention: "${m}"`);
            }
        });
    }

    public static validateComment(comment: string): void {
        if (comment.length <= 0) {
            throw new BadRequestError('Comment must not be empty');
        }

        if (comment.length > MAX_COMMENT_LENGTH) {
            throw new BadRequestError(
                `Comment exceeds ${MAX_COMMENT_LENGTH} characters`,
            );
        }
    }
}
