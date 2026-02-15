import { useEffect, useMemo, useState } from 'react';
import type { ImageDetails } from '../../types/image';
import { getUsers } from '../../api/users/usersService';
import type { UserListItem } from '../../types/user';

type Props = {
    image: ImageDetails;
};

const dateFormat = (iso: string): string => new Date(iso).toLocaleDateString();

export default function ImageCard({ image }: Props) {
    const [users, setUsers] = useState<UserListItem[]>([]);

    useEffect(() => {
        getUsers()
            .then(setUsers)
            .catch(() => setUsers([]));
    }, []);

    const userIdToUsername = useMemo(() => {
        const map = new Map<string, string>();
        for (const u of users) map.set(u.id, u.username);
        return map;
    }, [users]);

    const publisherUsername =
        userIdToUsername.get(image.userId) ?? image.userId;

    const taggedUsernames = useMemo(() => {
        return image.mentions.map((id) => userIdToUsername.get(id) ?? id);
    }, [image.mentions, userIdToUsername]);

    const hasDescription = image.description.trim().length > 0;

    return (
        <div className="border rounded-lg overflow-hidden shadow-sm bg-white dark:bg-dark">
            <img
                src={image.imageUrl}
                alt={image.id}
                className="w-full object-cover"
            />

            <div className="p-3 space-y-1 text-sm">
                <div className="text-gray-500 text-xs">
                    {dateFormat(image.createdAt)}
                </div>

                {hasDescription && (
                    <p className="text-base font-medium">{image.description}</p>
                )}

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
                        {taggedUsernames.map((name) => (
                            <span key={name} className="text-blue-500">
                                @{name}
                            </span>
                        ))}
                    </div>
                )}

                <div className="text-xs text-gray-500">
                    Published by{' '}
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                        @{publisherUsername}
                    </span>
                </div>
            </div>
        </div>
    );
}
