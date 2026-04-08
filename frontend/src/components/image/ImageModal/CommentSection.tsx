import type { ImageDetails } from '../../../types/image.ts';
import { Link } from 'react-router';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../../context/AuthContext.tsx';

type Props = {
    comments: ImageDetails['comments'];
    userIdToUsername: Map<string, string>;
    className?: string;
    onCommentDeleted: (commentId: string) => void;
};

export default function CommentSection({
    comments,
    userIdToUsername,
    onCommentDeleted,
    className,
}: Props) {
    const { me } = useAuth();
    return (
        <div className={`flex flex-col ${className}`}>
            <hr className="border-t border-dark-gray mt-3" />
            {comments.length > 0 ? (
                <p className="text-gray-400 text-xs uppercase tracking-widest mt-3">
                    Comments
                </p>
            ) : (
                <p className="text-gray-400 text-sm mt-3">No comments yet</p>
            )}

            <div className="overflow-y-auto flex-1 min-h-0 space-y-2 py-2 custom-scrollbar">
                {comments.map((c, i) => (
                    <div key={i} className="text-sm group">
                        <Link
                            to={`/Profile/${c.from}`}
                            className="font-medium mr-1 hover:underline"
                        >
                            @{userIdToUsername.get(c.from) ?? 'Unknown'}
                        </Link>
                        : <span className="wrap-break-word">{c.comment}</span>
                        {c.from === me?.id && (
                            <button
                                className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => onCommentDeleted(c.id!)}
                            >
                                <TrashIcon className="size-4 text-red-700" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
