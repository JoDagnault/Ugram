import { useEffect, useMemo, useState } from 'react';
import type { ImageDetails } from '../types/image';
import { getUsers } from '../api/users/usersService';
import type { UserListItem } from '../types/user';

type Props = {
    image: ImageDetails;
};

const formatDate = (iso: string): string => new Date(iso).toLocaleDateString();

export default function ImageCard({ image }: Props) {
    const [users, setUsers] = useState<UserListItem[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);

    useEffect(() => {
        getUsers()
            .then((u) => setUsers(u))
            .catch(() => setUsers([]))
            .finally(() => setLoadingUsers(false));
    }, []);

    const userIdToUsername = useMemo(() => {
        const map = new Map<string, string>();
        for (const u of users) map.set(u.id, u.username);
        return map;
    }, [users]);

    const publisherUsername =
        userIdToUsername.get(image.userId) ?? image.userId;

    const taggedUsernames = useMemo(() => {
        return image.mentionUserIds.map((id) => userIdToUsername.get(id) ?? id);
    }, [image.mentionUserIds, userIdToUsername]);

    const headline = image.description?.trim()
        ? image.description.trim()
        : 'Untitled image';

    return (
        <div className="border rounded-lg overflow-hidden bg-white dark:bg-dark shadow-sm">
            <div className="p-3">
                <div className="text-base font-semibold leading-snug">
                    {headline}
                </div>

                <div className="mt-1 text-xs text-gray-600 dark:text-gray-400 flex flex-wrap gap-x-3 gap-y-1">
                    <span>
                        Published by{' '}
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                            @{publisherUsername}
                        </span>
                    </span>

                    <span className="opacity-70">
                        {formatDate(image.createdAt)}
                    </span>

                    {loadingUsers && (
                        <span className="opacity-70 italic">
                            loading users…
                        </span>
                    )}
                </div>
            </div>

            {/* Image */}
            <img
                src={image.imageUrl}
                alt={image.id}
                className="w-full object-cover"
            />

            {/* Footer info */}
            <div className="p-3 space-y-2 text-sm">
                {image.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {image.hashtags.map((h) => (
                            <span key={h} className="text-blue-500">
                                #{h}
                            </span>
                        ))}
                    </div>
                )}

                {taggedUsernames.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        <span className="text-gray-600 dark:text-gray-400">
                            Tagged:
                        </span>
                        {taggedUsernames.map((name) => (
                            <span key={name} className="text-blue-500">
                                @{name}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
