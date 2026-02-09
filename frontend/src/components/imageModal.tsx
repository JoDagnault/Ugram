import { useEffect, useState } from 'react';
import type { ImageDetails, ImageDetailsFields } from '../types/image';
import {
    deleteMyImage,
    getImage,
    updateMyImage,
} from '../api/images/imagesService';
import ImageActionsMenu from './imageActionsMenu';
import EditImageForm from './editImageForm';

type Props = {
    imageId: string;
    isOwner: boolean; // déterminé par le parent (profile page)
    onClose: () => void;
    onDeleted?: (imageId: string) => void; // parent can refresh list
    onUpdated?: (next: ImageDetails) => void;
};

export default function ImageModal({
    imageId,
    isOwner,
    onClose,
    onDeleted,
    onUpdated,
}: Props) {
    const [image, setImage] = useState<ImageDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState<'view' | 'edit'>('view');

    useEffect(() => {
        let ignore = false;
        setLoading(true);

        getImage(imageId)
            .then((img) => {
                if (!ignore) setImage(img ?? null);
            })
            .finally(() => {
                if (!ignore) setLoading(false);
            });

        return () => {
            ignore = true;
        };
    }, [imageId]);

    const handleDelete = async () => {
        if (!isOwner) return;
        const ok = await deleteMyImage(imageId);
        if (ok) {
            onDeleted?.(imageId);
            onClose();
        }
    };

    const handleReport = () => {
        // UI only for now
        // later: open report modal / send request
        console.log('Report (TODO)');
    };

    const handleSave = async (nextFields: ImageDetailsFields) => {
        if (!isOwner) return;

        const updated = await updateMyImage(imageId, nextFields);
        if (updated) {
            setImage(updated);
            onUpdated?.(updated);
            setMode('view');
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white dark:bg-dark rounded p-4 w-[90%] max-w-xl">
                    Loading…
                </div>
            </div>
        );
    }

    if (!image) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white dark:bg-dark rounded p-4 w-[90%] max-w-xl">
                    <div className="flex justify-between items-center">
                        <div className="font-semibold">Image not found</div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-9 h-9 rounded hover:bg-gray-100 dark:hover:bg-black/20"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-dark rounded-lg w-[95%] max-w-3xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b">
                    <div className="font-semibold truncate">
                        {image.description?.trim() || 'Image'}
                    </div>

                    <div className="flex items-center gap-2">
                        <ImageActionsMenu
                            isOwner={isOwner}
                            onEdit={() => setMode('edit')}
                            onDelete={handleDelete}
                            onReport={handleReport}
                        />
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-9 h-9 rounded hover:bg-gray-100 dark:hover:bg-black/20"
                            aria-label="Close"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-black/5 rounded overflow-hidden">
                        <img
                            src={image.imageUrl}
                            alt={image.id}
                            className="w-full object-cover"
                        />
                    </div>

                    <div>
                        {mode === 'edit' && isOwner ? (
                            <EditImageForm
                                initial={{
                                    description: image.description,
                                    hashtags: image.hashtags,
                                    mentionUserIds: image.mentionUserIds,
                                }}
                                onCancel={() => setMode('view')}
                                onSubmit={handleSave}
                            />
                        ) : (
                            <div className="space-y-3">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Posted on{' '}
                                    {new Date(
                                        image.createdAt,
                                    ).toLocaleDateString()}
                                </div>

                                {image.hashtags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {image.hashtags.map((h) => (
                                            <span
                                                key={h}
                                                className="text-blue-500"
                                            >
                                                #{h}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {image.mentionUserIds.length > 0 && (
                                    <div className="text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            Tagged:{' '}
                                        </span>
                                        {image.mentionUserIds.join(', ')}
                                    </div>
                                )}

                                <div className="text-xs text-gray-500 italic">
                                    Comments / likes coming soon…
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
