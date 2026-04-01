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

    const maxVisible = 2;
    const visible = taggedUsernames.slice(0, maxVisible);
    const remaining = taggedUsernames.length - maxVisible;

    const visibleHashtags = image.hashtags.slice(0, maxVisible);
    const remainingHashtags = image.hashtags.length - maxVisible;

    const hasDescription = image.description.trim().length > 0;

    return (
        <div className="flex justify-center w-full">
            <div className="flex flex-col border rounded-lg w-95/100 min-w-[290px] min-[750px]:w-7/10 min-[1242px]:w-9/10">
                <div className="w-full flex items-center justify-center overflow-hidden">
                    <img
                        src={image.imageUrl}
                        alt={image.id}
                        className="w-full h-auto max-w-full max-h-[70vh] object-contain block"
                        loading="lazy"
                    />
                </div>

                <div className="flex flex-col p-2.5 min-[750px]:p-3 min-[1242px]:p-4 space-y-1.5 min-[750px]:space-y-2 text-xs min-[750px]:text-sm">
                    <div className="text-xs min-[750px]:text-sm text-gray-500">
                        {dateFormat(image.createdAt)}
                    </div>

                    {hasDescription && (
                        <p className="text-sm min-[1242px]:text-lg font-medium truncate">
                            {image.description}
                        </p>
                    )}

                    <div>
                        {image.hashtags.length > 0 && (
                            <div className="flex gap-1 min-[750px]:gap-1.5 overflow-hidden">
                                {visibleHashtags.map((h) => (
                                    <span
                                        key={h}
                                        className="text-blue-500 text-xs min-[750px]:text-sm shrink-0"
                                    >
                                        #{h}
                                    </span>
                                ))}
                                {remainingHashtags > 0 && (
                                    <span className="text-gray-500 text-xs min-[750px]:text-sm shrink-0">
                                        +{remainingHashtags}
                                    </span>
                                )}
                            </div>
                        )}

                        {taggedUsernames.length > 0 && (
                            <div className="flex gap-1 min-[750px]:gap-1.5 overflow-hidden">
                                {visible.map((name) => (
                                    <span
                                        key={name}
                                        className="text-blue-500 text-xs min-[750px]:text-sm shrink-0"
                                    >
                                        @{name}
                                    </span>
                                ))}
                                {remaining > 0 && (
                                    <span className="text-gray-500 text-xs min-[750px]:text-sm shrink-0">
                                        +{remaining}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex w-full justify-between">
                        <div className="text-xs min-[750px]:text-sm text-gray-500">
                            Published by{' '}
                            <span className="font-medium text-gray-800 dark:text-gray-200 break-all truncate">
                                @{publisherUsername}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
