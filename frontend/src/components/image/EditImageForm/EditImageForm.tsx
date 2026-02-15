import { useMemo, useRef, useState, type FormEvent } from 'react';
import type { ImageDetailsFields } from '../../../types/image.ts';
import type { UserListItem } from '../../../types/user.ts';
import RemovableChip from '../../common/RemovableChip.tsx';
import useHashtagEditor, { MAX_HASHTAGS } from './useHashtagEditor.ts';
import useMentionEditor from './useMentionEditor.ts';

type ImageFormErrors = {
    description?: string;
    hashtags?: string;
    file?: string;
};

export type ImageFormSubmission = ImageDetailsFields & {
    file?: File;
};

const MAX_DESCRIPTION_LENGTH = 300;

const toMentionLabel = (value: string): string =>
    value.startsWith('@') ? value : `@${value}`;

type Props = {
    initial: ImageDetailsFields;
    users: UserListItem[];
    currentUsername?: string;
    mode?: 'edit' | 'create';
    onCancel: () => void;
    onSubmit: (next: ImageFormSubmission) => void;
};

export default function EditImageForm({
    initial,
    users,
    currentUsername,
    mode = 'edit',
    onCancel,
    onSubmit,
}: Props) {
    const isCreateMode = mode === 'create';

    const [description, setDescription] = useState(initial.description);
    const [file, setFile] = useState<File>();
    const [errors, setErrors] = useState<ImageFormErrors>({});
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const {
        hashtags,
        hashtagsInput,
        setHashtagsInput,
        commitHashtagsInput,
        removeHashtag,
    } = useHashtagEditor(initial.hashtags);

    const {
        mentionUserIds,
        mentionsInput,
        mentionSuggestions,
        setMentionsInput,
        addMention,
        removeMention,
    } = useMentionEditor({
        initialMentionUserIds: initial.mentionUserIds,
        users,
    });

    const userIdToUsername = useMemo(
        () => new Map(users.map((user) => [user.id, user.username])),
        [users],
    );

    const setHashtagsError = (hashtags?: string) => {
        setErrors((current) => ({
            ...current,
            hashtags,
        }));
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        const next: ImageFormSubmission = {
            description: description.trim(),
            hashtags,
            mentionUserIds,
            file,
        };

        const nextErrors: ImageFormErrors = {};
        if (next.description.length > MAX_DESCRIPTION_LENGTH) {
            nextErrors.description = `Max ${MAX_DESCRIPTION_LENGTH} characters`;
        }
        if (isCreateMode && !next.file) {
            nextErrors.file = 'Image file is required';
        }

        if (hashtagsInput.trim()) {
            nextErrors.hashtags =
                'Click "Add" to add your hashtags before posting';
        }

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
                    onChange={(event) => setDescription(event.target.value)}
                    className="w-full border rounded p-2 bg-white dark:bg-dark"
                    rows={3}
                    placeholder="Write a caption..."
                    maxLength={MAX_DESCRIPTION_LENGTH}
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

            {isCreateMode && (
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Image
                    </label>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(event) =>
                            setFile(event.target.files?.[0] ?? undefined)
                        }
                        className="sr-only"
                        tabIndex={-1}
                    />
                    <div className="flex items-center gap-2">
                        <div className="w-full border rounded p-2 bg-gray-100 dark:bg-black/20 text-gray-500 dark:text-gray-400 cursor-not-allowed select-none">
                            {file?.name ?? 'No file selected'}
                        </div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-2 rounded border border-gray-400 dark:border-gray-500 bg-white dark:bg-dark text-gray-900 dark:text-gray-100 hover:bg-accent hover:text-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
                        >
                            Browse
                        </button>
                    </div>
                    {errors.file && (
                        <p className="text-xs text-red-500 mt-1">
                            {errors.file}
                        </p>
                    )}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium mb-1">
                    Hashtags (comma separated)
                </label>
                <div className="flex items-center gap-2">
                    <input
                        value={hashtagsInput}
                        onChange={(event) => {
                            setHashtagsInput(event.target.value);
                            setHashtagsError();
                        }}
                        onKeyDown={(event) => {
                            if (event.key !== 'Enter') return;
                            event.preventDefault();
                            setHashtagsError(commitHashtagsInput());
                        }}
                        className="w-full border rounded p-2 bg-white dark:bg-dark"
                        placeholder="#travel, #winter"
                    />
                    <button
                        type="button"
                        onClick={() => setHashtagsError(commitHashtagsInput())}
                        className="px-3 py-2 rounded border border-gray-400 dark:border-gray-500 bg-white dark:bg-dark text-gray-900 dark:text-gray-100 hover:bg-accent hover:text-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
                    >
                        Add
                    </button>
                </div>

                <div className="text-xs text-gray-500 mt-1">
                    {hashtags.length}/{MAX_HASHTAGS} hashtags
                </div>

                {hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {hashtags.map((tag) => (
                            <RemovableChip
                                key={tag.toLowerCase()}
                                label={`#${tag}`}
                                removeLabel={`Remove hashtag ${tag}`}
                                onRemove={() => {
                                    removeHashtag(tag);
                                    setHashtagsError();
                                }}
                            />
                        ))}
                    </div>
                )}

                {errors.hashtags && (
                    <p className="text-xs text-red-500 mt-1">
                        {errors.hashtags}
                    </p>
                )}
            </div>

            <div className="relative">
                <label className="block text-sm font-medium mb-1">
                    Mentions
                </label>
                <input
                    value={mentionsInput}
                    onChange={(event) => setMentionsInput(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key !== 'Enter') return;
                        event.preventDefault();
                        if (mentionSuggestions.length === 0) return;
                        addMention(mentionSuggestions[0].id);
                    }}
                    className="w-full border rounded p-2 bg-white dark:bg-dark"
                    placeholder={
                        currentUsername ? `@${currentUsername}` : '@username'
                    }
                />

                {mentionSuggestions.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark max-h-48 overflow-auto shadow-lg">
                        {mentionSuggestions.map((user) => (
                            <button
                                key={user.id}
                                type="button"
                                onClick={() => addMention(user.id)}
                                className="w-full text-left px-3 py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-200 dark:hover:bg-white/20 focus-visible:outline-none focus-visible:bg-gray-200 dark:focus-visible:bg-white/20"
                            >
                                @{user.username}
                            </button>
                        ))}
                    </div>
                )}

                {mentionUserIds.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {mentionUserIds.map((userId) => {
                            const mentionLabel = toMentionLabel(
                                userIdToUsername.get(userId) ?? userId,
                            );

                            return (
                                <RemovableChip
                                    key={userId}
                                    label={mentionLabel}
                                    removeLabel={`Remove mention ${mentionLabel}`}
                                    onRemove={() => removeMention(userId)}
                                />
                            );
                        })}
                    </div>
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
                    className="px-3 py-2 rounded border border-gray-400 dark:border-gray-500 bg-accent text-dark hover:bg-accent/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
                >
                    {isCreateMode ? 'Post' : 'Save'}
                </button>
            </div>
        </form>
    );
}
