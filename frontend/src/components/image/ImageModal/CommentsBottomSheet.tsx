import { XMarkIcon } from '@heroicons/react/24/outline';
import type { ImageDetails } from '../../../types/image';
import CommentSection from './CommentSection.tsx';
import CommentInput from './CommentInput.tsx';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    image: ImageDetails;
    userIdToUsername: Map<string, string>;
    onCommentDeleted: (commentId: string) => void;
    onCommentPosted: (updated: ImageDetails) => void;
};

export default function CommentsBottomSheet({
    isOpen,
    onClose,
    image,
    userIdToUsername,
    onCommentDeleted,
    onCommentPosted,
}: Props) {
    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={onClose}
            />

            <div className="fixed bottom-0 left-0 right-0 z-50 bg-dark rounded-t-2xl max-h-[80vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-dark-gray">
                    <h2 className="text-lg font-semibold">
                        Comments ({image.comments.length})
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-dark-secondary rounded-lg transition"
                    >
                        <XMarkIcon className="size-6" />
                    </button>
                </div>

                <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
                    <CommentSection
                        comments={image.comments}
                        userIdToUsername={userIdToUsername}
                        onCommentDeleted={onCommentDeleted}
                        className="flex-1 min-h-0 ml-4 "
                    />

                    <div className="flex-shrink-0 p-3 border-t border-dark-gray">
                        <CommentInput
                            imageId={image.id}
                            onCommentPosted={onCommentPosted}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
