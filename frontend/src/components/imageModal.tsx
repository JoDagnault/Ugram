import { useEffect, useMemo, useState } from 'react';
import type { ImageDetails, ImageDetailsFields } from '../types/image';
import {
    deleteMyImage,
    getImage,
    updateMyImage,
} from '../api/images/imagesService';
import ImageActionsMenu from './imageActionsMenu';
import EditImageForm from './editImageForm';
import { getUsers } from '../api/users/usersService';
import type { UserListItem } from '../types/user';

type Props = {
    imageId: string;
    isOwner: boolean;
    onClose: () => void;
    onDeleted?: (imageId: string) => void;
    onUpdated?: (next: ImageDetails) => void;
};

const dateFormat = (iso: string): string => new Date(iso).toLocaleDateString();

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

    const [users, setUsers] = useState<UserListItem[]>([]);

    useEffect(() => {
        let ignore = false;
        getUsers()
            .then((u) => {
                if (!ignore) setUsers(u);
            })
            .catch(() => {
                if (!ignore) setUsers([]);
            });

        return () => {
            ignore = true;
        };
    }, []);

    const userIdToUsername = useMemo(() => {
        const map = new Map<string, string>();
        for (const u of users) map.set(u.id, u.username);
        return map;
    }, [users]);

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

    const handleReport = () => {};

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

    const taggedUsernames = image.mentionUserIds.map(
        (id) => userIdToUsername.get(id) ?? id,
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-dark rounded-lg w-[95%] max-w-3xl overflow-hidden">
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
                                    Posted on {dateFormat(image.createdAt)}
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

                                {taggedUsernames.length > 0 && (
                                    <div className="text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            Tagged:{' '}
                                        </span>
                                        {taggedUsernames
                                            .map((name) =>
                                                name.startsWith('@')
                                                    ? name
                                                    : `@${name}`,
                                            )
                                            .join(', ')}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
