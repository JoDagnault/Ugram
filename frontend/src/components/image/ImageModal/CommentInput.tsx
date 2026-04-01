import { useState } from 'react';
import { z } from 'zod';
import type { ImageDetails } from '../../../types/image.ts';
import { commentImage } from '../../../api/images/imagesService.ts';

type Props = {
    imageId: string;
    onCommentPosted: (updated: ImageDetails) => void;
    className?: string;
};

const MAX_COMMENT_LENGTH = 400;

const CommentSchema = z
    .string()
    .min(1, 'Comment cannot be empty.')
    .max(MAX_COMMENT_LENGTH, `Max ${MAX_COMMENT_LENGTH} characters`);

export default function CommentInput({
    imageId,
    onCommentPosted,
    className,
}: Props) {
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        const result = CommentSchema.safeParse(comment.trim());
        if (!result.success) {
            setError(result.error.issues[0].message);
            return;
        }

        setIsSubmitting(true);
        setError('');
        try {
            const updated = await commentImage(imageId, result.data);
            if (updated) {
                onCommentPosted(updated);
                setComment('');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`${className}`}>
            <div className="flex w-full border rounded p-2">
                <textarea
                    value={comment}
                    onChange={(e) => {
                        setComment(e.target.value);
                        if (error) setError('');
                    }}
                    className="flex-1 resize-none outline-none pr-3 custom-scrollbar"
                    rows={3}
                    placeholder="Write your comment..."
                    maxLength={MAX_COMMENT_LENGTH}
                />
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="p-1"
                >
                    {isSubmitting ? 'Posting...' : 'Post'}
                </button>
            </div>
            <div className="text-xs text-gray-500 mt-1">
                {comment.length}/{MAX_COMMENT_LENGTH}
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}
