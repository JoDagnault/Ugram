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

    // nettoie la saisie pour la comparer
    const normalizedUserQuery = userQuery.trim().toLowerCase();
    const normalizedImageQuery = imageQuery.trim().toLowerCase();

    // filtre les utilisateurs
    let filteredUsers: UserListItem[] = [];
    if (normalizedUserQuery.length > 0) {
        filteredUsers = users.filter((u) => {
            const username = u.username.toLowerCase();
            return username.includes(normalizedUserQuery);
        });
    }

    // filtre les images par id
    let filteredImages: ImageDetails[] = [];
    if (normalizedImageQuery.length > 0) {
        filteredImages = images.filter((img) => {
            const id = img.id.toLowerCase();
            return id.includes(normalizedImageQuery);
        });
    }

    // affiche un loader pendant le chargement
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
                {imageQuery.trim().length > 0 && (
                    <ImageSearchResults images={filteredImages} />
                )}
            </div>
        </div>
    );
}
