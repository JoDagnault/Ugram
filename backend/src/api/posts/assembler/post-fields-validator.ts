import { PostFieldsDto } from '../dto/post-fields.dto';

export class PostFieldsValidator {
    static validatePostFields(fields: PostFieldsDto): PostFieldsDto {
        const hashtags: string[] = this.parseStringArray(fields.hashtags);
        const mentions: string[] = this.parseStringArray(fields.mentions);

        let description: string | undefined = fields.description?.trim();

        if (description) {
            if (description.startsWith('"') && description.endsWith('"')) {
                description = description.slice(1, -1);
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
                    throw new Error();
                }

                return parsed.filter((x) => typeof x === 'string');
            } catch {
                throw new Error('Must be an array of strings');
            }
        }

        throw new Error('Must be an array of strings');
    }

    private static validateHashtags(tags: string[]) {
        const regex = /^[a-zA-Z0-9_]+$/;

        tags.forEach((tag) => {
            if (!regex.test(tag)) {
                throw new Error(`Invalid hashtag: "${tag}"`);
            }
        });
    }

    private static validateMentions(mentions: string[]) {
        const regex = /^[a-zA-Z0-9._]+$/;

        mentions.forEach((m) => {
            if (!regex.test(m)) {
                throw new Error(`Invalid mention: "${m}"`);
            }
        });
    }
}
