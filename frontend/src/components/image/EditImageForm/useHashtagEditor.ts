import { useState } from 'react';
import { z } from 'zod';

export const MAX_HASHTAGS = 10;
export const MAX_HASHTAG_LENGTH = 30;

const HashtagSchema = z
    .string()
    .max(
        MAX_HASHTAG_LENGTH,
        `Hashtag too long (max ${MAX_HASHTAG_LENGTH} characters)`,
    )
    .regex(
        /^[a-zA-Z0-9_]+$/,
        'Hashtags must contain only letters, numbers, underscore',
    );
export default function useHashtagEditor(initialHashtags: string[]) {
    const [hashtags, setHashtags] = useState<string[]>(initialHashtags);
    const [hashtagsInput, setHashtagsInput] = useState('');

    const commitHashtagsInput = (): string | undefined => {
        if (!hashtagsInput.trim()) return undefined;

        const nextHashtags = [...hashtags];
        const seen = new Set(nextHashtags.map((tag) => tag.toLowerCase()));
        let error: string | undefined;

        for (const token of hashtagsInput.split(',')) {
            const candidate = token.trim().replace(/^#/, '');
            if (!candidate) continue;

            const result = HashtagSchema.safeParse(candidate);
            if (!result.success) {
                error = result.error.issues[0].message;
                continue;
            }

            const normalized = candidate.toLowerCase();
            if (seen.has(normalized)) continue;

            if (nextHashtags.length >= MAX_HASHTAGS) {
                error = `Max ${MAX_HASHTAGS} hashtags`;
                continue;
            }

            seen.add(normalized);
            nextHashtags.push(candidate);
        }

        if (nextHashtags.length !== hashtags.length) {
            setHashtags(nextHashtags);
        }
        if (!error) {
            setHashtagsInput('');
        }

        return error;
    };

    const removeHashtag = (tag: string) => {
        setHashtags((current) => current.filter((value) => value !== tag));
    };

    return {
        hashtags,
        hashtagsInput,
        setHashtagsInput,
        commitHashtagsInput,
        removeHashtag,
    };
}
