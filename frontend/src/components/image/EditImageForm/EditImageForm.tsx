import {
    useMemo,
    useRef,
    useState,
    type ChangeEvent,
    type FormEvent,
} from 'react';
import type { ImageDetailsFields } from '../../../types/image.ts';
import type { UserListItem } from '../../../types/user.ts';
import RemovableChip from '../../common/RemovableChip.tsx';
import useHashtagEditor, {
    MAX_HASHTAGS,
    MAX_HASHTAG_LENGTH,
} from './useHashtagEditor.ts';
import useMentionEditor from './useMentionEditor.ts';
import { prepareImageForUpload } from '../imageCompression.ts';
import ImageEditor, { type ImageEditorResult } from './ImageEditor.tsx';

type ImageFormErrors = {
    description?: string;
    hashtags?: string;
    file?: string;
    submit?: string;
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
    onSubmit: (next: ImageFormSubmission) => Promise<void> | void;
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const isSubmitDisabled = isSubmitting || (isCreateMode && !file);

    const {
        hashtags,
        hashtagsInput,
        setHashtagsInput,
        commitHashtagsInput,
        removeHashtag,
    } = useHashtagEditor(initial.hashtags);

    const {
        mentions,
        mentionsInput,
        mentionSuggestions,
        setMentionsInput,
        addMention,
        removeMention,
    } = useMentionEditor({
        initialMentions: initial.mentions,
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

    const setFileError = (file?: string) => {
        setErrors((current) => ({
            ...current,
            file,
        }));
    };

    const setSubmitError = (submit?: string) => {
        setErrors((current) => ({
            ...current,
            submit,
        }));
    };

    const [pendingFile, setPendingFile] = useState<File | undefined>(undefined);

    const handleSelectedFile = async (selectedFile?: File) => {
        if (!selectedFile) {
            setFile(undefined);
            setFileError();
            return;
        }

        setPendingFile(selectedFile);
        setFileError();
        setSubmitError();
    };

    const handleEditorConfirm = async ({
        file: resizedFile,
    }: ImageEditorResult) => {
        try {
            setFile(await prepareImageForUpload(resizedFile));
            setFileError();
            setSubmitError();
        } catch (error) {
            setFile(undefined);
            setFileError(
                error instanceof Error
                    ? error.message
                    : 'Unable to process the selected image',
            );
        } finally {
            setPendingFile(undefined);
        }
    };

    const handleEditorCancel = () => {
        setPendingFile(undefined);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        void handleSelectedFile(event.target.files?.[0]);
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const next: ImageFormSubmission = {
            description: description.trim(),
            hashtags,
            mentions,
            file,
        };

        const nextErrors: ImageFormErrors = {};
        if (next.description.length > MAX_DESCRIPTION_LENGTH) {
            nextErrors.description = `Max ${MAX_DESCRIPTION_LENGTH} characters`;
        }
        if (isCreateMode && !next.file) {
            nextErrors.file = errors.file ?? 'Image file is required';
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

        try {
            setIsSubmitting(true);
            await onSubmit(next);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Unable to submit the image';

            if (isCreateMode && message === 'Image is too large') {
                setErrors({ file: message });
                return;
            }

            setErrors({ submit: message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div>
                <label className="text-gray-400 text-xs uppercase tracking-widest mb-1">
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
                    <label className="text-gray-400 text-xs uppercase tracking-widest mb-1">
                        Image
                    </label>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="sr-only"
                        tabIndex={-1}
                    />
                    {pendingFile ? (
                        <ImageEditor
                            sourceFile={pendingFile}
                            onConfirm={handleEditorConfirm}
                            onCancel={handleEditorCancel}
                        />
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className="w-full border rounded p-2 bg-gray-100 dark:bg-black/20 text-gray-500 dark:text-gray-400 cursor-not-allowed select-none truncate">
                                {file?.name ?? 'No file selected'}
                            </div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-3 py-2 rounded-full border dark:border-gray-500 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
                            >
                                Browse
                            </button>
                        </div>
                    )}
                    {errors.file && (
                        <p className="text-xs text-red-500 mt-1">
                            {errors.file}
                        </p>
                    )}
                </div>
            )}

            <div>
                <label className="text-gray-400 text-xs uppercase tracking-widest mb-1">
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
                        className="px-3 py-2 rounded-full border border-gray-500 bg-dark hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
                    >
                        Add
                    </button>
                </div>

                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span
                        className={
                            hashtagsInput.length > MAX_HASHTAG_LENGTH
                                ? 'text-red-500'
                                : ''
                        }
                    >
                        {hashtagsInput.length}/{MAX_HASHTAG_LENGTH}
                    </span>

                    <span>
                        {hashtags.length}/{MAX_HASHTAGS} hashtags
                    </span>
                </div>

                {hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {hashtags.map((tag) => (
                            <RemovableChip
                                key={tag.toLowerCase()}
                                label={`#${tag.toLowerCase()}`}
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
                <label className="text-gray-400 text-xs uppercase tracking-widest mb-1">
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
                {mentionSuggestions.length <= 0 && mentionsInput.length > 0 && (
                    <div>
                        <p className="text-sm text-red-600 dark:text-red-400">
                            User not found, this mention will not be added to
                            your post
                        </p>
                    </div>
                )}

                {mentions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {mentions.map((userId) => {
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
                {errors.submit && (
                    <p className="mr-auto self-center text-xs text-red-500">
                        {errors.submit}
                    </p>
                )}
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-3 py-2 rounded-full border hover:bg-dark-gray hover:opacity-90"
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitDisabled}
                    className="px-3 py-2 rounded-full border dark:border-gray-500 bg-accent hover:bg-accent/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
                >
                    {isSubmitting
                        ? 'Submitting...'
                        : isCreateMode
                          ? 'Post'
                          : 'Save'}
                </button>
            </div>
        </form>
    );
}
