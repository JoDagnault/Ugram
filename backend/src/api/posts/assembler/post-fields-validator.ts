import { PostFieldsDto } from '../dto/post-fields.dto';
import { BadRequestError } from '../../../errors/bad-request.error';

const MAX_HASHTAG_LENGTH = 30;
const MAX_DESCRIPTION_LENGTH = 300;

export class PostFieldsValidator {
    static validatePostFields(fields: PostFieldsDto): PostFieldsDto {
        const hashtags: string[] = this.parseStringArray(fields.hashtags);
        const mentions: string[] = this.parseStringArray(fields.mentions);

        let description: string | undefined = fields.description?.trim();

        if (description) {
            if (description.startsWith('"') && description.endsWith('"')) {
                description = description.slice(1, -1);
            }

            if (description.length > MAX_DESCRIPTION_LENGTH) {
                throw new BadRequestError(
                    `Description exceeds ${MAX_DESCRIPTION_LENGTH} characters`,
                );
            }
        }
        const cleanHashtags = hashtags.map((tag) =>
            tag.replace(/^#/, '').trim().toLowerCase(),
        );

        this.validateHashtags(cleanHashtags);

        const cleanMentions = mentions.map((m) => m.replace(/^@/, '').trim());

        this.validateMentions(cleanMentions);

        return {
            description: description || '',
            hashtags: cleanHashtags,
            mentions: cleanMentions,
        };
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

    private static validateHashtags(tags: string[]) {
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

    private static validateMentions(mentions: string[]) {
        const regex = /^[a-zA-Z0-9._-]+$/;

        mentions.forEach((m) => {
            if (!regex.test(m)) {
                throw new BadRequestError(`Invalid mention: "${m}"`);
            }
        });
    }
}
