import { useMemo, useState, type FormEvent } from 'react';
import type { ImageDetailsFields } from '../types/image';

type Props = {
    initial: ImageDetailsFields;
    onCancel: () => void;
    onSubmit: (next: ImageDetailsFields) => void;
};

type Errors = Partial<Record<keyof ImageDetailsFields, string>>;

const MAX_DESCRIPTION_LENGTH = 300;
const MAX_HASHTAGS = 10;

const normalizeHashtags = (raw: string): string[] => {
    const parts = raw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => (s.startsWith('#') ? s.slice(1) : s));

    // unique (case-insensitive)
    const seen = new Set<string>();
    const result: string[] = [];
    for (const tag of parts) {
        const key = tag.toLowerCase();
        if (!seen.has(key)) {
            seen.add(key);
            result.push(tag);
        }
    }
    return result;
};

const validate = (data: ImageDetailsFields): Errors => {
    const errors: Errors = {};

    if (data.description.length > MAX_DESCRIPTION_LENGTH) {
        errors.description = `Max ${MAX_DESCRIPTION_LENGTH} characters`;
    }

    if (data.hashtags.length > MAX_HASHTAGS) {
        errors.hashtags = `Max ${MAX_HASHTAGS} hashtags`;
    }

    for (const tag of data.hashtags) {
        if (!/^[a-zA-Z0-9_]+$/.test(tag)) {
            errors.hashtags =
                'Hashtags must contain only letters, numbers, underscore';
            break;
        }
    }

    return errors;
};

export default function EditImageForm({ initial, onCancel, onSubmit }: Props) {
    const [description, setDescription] = useState(initial.description);
    const [hashtagsRaw, setHashtagsRaw] = useState(
        initial.hashtags.map((h) => `#${h}`).join(', '),
    );
    const [errors, setErrors] = useState<Errors>({});

    const hashtags = useMemo(
        () => normalizeHashtags(hashtagsRaw),
        [hashtagsRaw],
    );

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const next: ImageDetailsFields = {
            description: description.trim(),
            hashtags,
            mentionUserIds: initial.mentionUserIds, // V1: keep as-is
        };

        const nextErrors = validate(next);
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        setErrors({});
        onSubmit(next);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div>
                <label className="block text-sm font-medium mb-1">
                    Description
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border rounded p-2 bg-white dark:bg-dark"
                    rows={3}
                    placeholder="Write a caption…"
                />
                <div className="text-xs text-gray-500 mt-1">
                    {description.length}/{MAX_DESCRIPTION_LENGTH}
                </div>
                {errors.description && (
                    <p className="text-xs text-red-500 mt-1">
                        {errors.description}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">
                    Hashtags (comma separated)
                </label>
                <input
                    value={hashtagsRaw}
                    onChange={(e) => setHashtagsRaw(e.target.value)}
                    className="w-full border rounded p-2 bg-white dark:bg-dark"
                    placeholder="#travel, #winter"
                />
                {errors.hashtags && (
                    <p className="text-xs text-red-500 mt-1">
                        {errors.hashtags}
                    </p>
                )}
            </div>

            <div className="flex gap-2 justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-3 py-2 rounded border bg-white dark:bg-dark hover:opacity-90"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-3 py-2 rounded bg-dark-gray text-white hover:bg-accent"
                >
                    Save
                </button>
            </div>
        </form>
    );
}
