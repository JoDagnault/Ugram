import { Link } from 'react-router';
import type { ImageDetails } from '../../../types/image.ts';

type Props = {
    likes: ImageDetails['likes'];
    userIdToUsername: Map<string, string>;
    onClose: () => void;
};

export default function LikesModal({
    likes,
    userIdToUsername,
    onClose,
}: Props) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <div
                className="bg-dark-secondary rounded-lg w-80 max-h-96 flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-dark-gray">
                    <h2 className="font-medium">Likes</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 min-h-0 custom-scrollbar">
                    {likes.length === 0 ? (
                        <p className="text-gray-400 text-sm p-4">
                            No likes yet
                        </p>
                    ) : (
                        likes.map((like) => (
                            <Link
                                key={like.from}
                                to={`/Profile/${like.from}`}
                                className="flex items-center gap-2 px-4 py-2.5 hover:bg-dark-gray transition-colors"
                            >
                                <span className="text-sm font-medium">
                                    @
                                    {userIdToUsername.get(like.from) ??
                                        'Unknown'}
                                </span>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
