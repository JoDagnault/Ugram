import { useState } from 'react';

const HASHTAG_PATTERN = /^[a-zA-Z0-9_]+$/;

export const MAX_HASHTAGS = 10;
const HASHTAG_CHARACTERS_ERROR =
    'Hashtags must contain only letters, numbers, underscore';
const MAX_HASHTAGS_ERROR = `Max ${MAX_HASHTAGS} hashtags`;

export default function useHashtagEditor(initialHashtags: string[]) {
    const [hashtags, setHashtags] = useState<string[]>(initialHashtags);
    const [hashtagsInput, setHashtagsInput] = useState('');

    const commitHashtagsInput = (): string | undefined => {
        if (!hashtagsInput.trim()) return undefined;

        const nextHashtags = [...hashtags];
        const seen = new Set(nextHashtags.map((tag) => tag.toLowerCase()));
        let hasInvalidCharacters = false;
        let reachedLimit = false;

        for (const token of hashtagsInput.split(',')) {
            const candidate = token.trim().replace(/^#/, '');
            if (!candidate) continue;

            if (!HASHTAG_PATTERN.test(candidate)) {
                hasInvalidCharacters = true;
                continue;
            }

            const normalizedCandidate = candidate.toLowerCase();
            if (seen.has(normalizedCandidate)) continue;
            if (nextHashtags.length >= MAX_HASHTAGS) {
                reachedLimit = true;
                continue;
            }

            seen.add(normalizedCandidate);
            nextHashtags.push(candidate);
        }

        if (nextHashtags.length !== hashtags.length) {
            setHashtags(nextHashtags);
        }
        if (!hasInvalidCharacters && !reachedLimit) {
            setHashtagsInput('');
        }

        if (hasInvalidCharacters) return HASHTAG_CHARACTERS_ERROR;
        if (reachedLimit) return MAX_HASHTAGS_ERROR;
        return undefined;
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
