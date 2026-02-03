import { useEffect, useMemo, useState } from 'react';
import { getUsers } from '../api/users/usersService';
import { getFeedImages } from '../api/images/imagesService';
import type { UserListItem } from '../types/user';
import type { ImageDetails } from '../types/image';

import UserSearchResults from '../components/userSearchResults.tsx';
import ImageSearchResults from '../components/imageSearchResults.tsx';

export default function Search() {
    const [users, setUsers] = useState<UserListItem[]>([]);
    const [images, setImages] = useState<ImageDetails[]>([]);
    const [userQuery, setUserQuery] = useState('');
    const [imageQuery, setImageQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getUsers(), getFeedImages()])
            .then(([u, imgs]) => {
                setUsers(u);
                setImages(imgs);
            })
            .catch((err) => {
                console.error('Search load error', err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // ALWAYS call useMemo (even if empty string)
    const filteredUsers = useMemo(() => {
        const q = userQuery.trim().toLowerCase();
        return q
            ? users.filter((u) => u.username.toLowerCase().includes(q))
            : [];
    }, [users, userQuery]);

    const filteredImages = useMemo(() => {
        const q = imageQuery.trim().toLowerCase();
        return q
            ? images.filter((img) => img.id.toLowerCase().includes(q))
            : [];
    }, [images, imageQuery]);

    if (loading) {
        return <p className="p-4">Loading…</p>;
    }

    return (
        <div className="p-4 space-y-8 max-w-3xl mx-auto">
            {/* Users search */}
            <div>
                <input
                    type="search"
                    placeholder="Search users…"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    className="w-full border p-2 rounded"
                />
                {/* Show results only if there is query */}
                {userQuery.trim().length > 0 && (
                    <UserSearchResults users={filteredUsers} />
                )}
            </div>

            {/* Images search */}
            <div>
                <input
                    type="search"
                    placeholder="Search images by ID…"
                    value={imageQuery}
                    onChange={(e) => setImageQuery(e.target.value)}
                    className="w-full border p-2 rounded"
                />
                {/* Show results only if there is query */}
                {imageQuery.trim().length > 0 && (
                    <ImageSearchResults images={filteredImages} />
                )}
            </div>
        </div>
    );
}
