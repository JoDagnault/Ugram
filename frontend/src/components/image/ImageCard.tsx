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
        <div className="flex justify-center w-full">
            <div className="border rounded-lg overflow-hidden shadow-sm bg-white dark:bg-dark w-60 min-[640px]:w-70 min-[750px]:w-[320px] min-[1024px]:w-112.5 min-[1242px]:w-137.5 min-[1366px]:w-162.5 min-[1536px]:w-200 min-[1920px]:w-225">
                <div className="w-full h-87.5 min-[640px]:h-100 min-[750px]:h-112.5 min-[1024px]:h-150 min-[1242px]:h-175 min-[1366px]:h-200  bg-white dark:bg-dark flex items-center justify-center">
                    <img
                        src={image.imageUrl}
                        alt={image.id}
                        className="max-w-full max-h-full object-contain"
                        loading="lazy"
                    />
                </div>

                <div className="p-2.5 min-[750px]:p-3 min-[1242px]:p-4 space-y-1.5 min-[750px]:space-y-2 text-xs min-[750px]:text-sm">
                    <div className="text-gray-500 text-xs min-[750px]:text-sm">
                        {dateFormat(image.createdAt)}
                    </div>

                    {hasDescription && (
                        <p className="text-sm min-[750px]:text-base min-[1242px]:text-lg font-medium break-words">
                            {image.description}
                        </p>
                    )}

                    {image.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1 min-[750px]:gap-1.5">
                            {image.hashtags.map((h) => (
                                <span
                                    key={h}
                                    className="text-blue-500 text-xs min-[750px]:text-sm break-all"
                                >
                                    #{h}
                                </span>
                            ))}
                        </div>
                    )}

                    {taggedUsernames.length > 0 && (
                        <div className="flex flex-wrap gap-1 min-[750px]:gap-1.5">
                            {taggedUsernames.map((name) => (
                                <span
                                    key={name}
                                    className="text-blue-500 text-xs min-[750px]:text-sm break-all"
                                >
                                    @{name}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="text-xs min-[750px]:text-sm text-gray-500">
                        Published by{' '}
                        <span className="font-medium text-gray-800 dark:text-gray-200 break-all">
                            @{publisherUsername}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
