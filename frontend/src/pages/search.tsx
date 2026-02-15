import { useEffect, useMemo, useState } from 'react';
import { getMe, getUsers } from '../api/users/usersService';
import type { UserListItem } from '../types/user';
import ImageSearchResults from '../components/search/ImageSearchResults.tsx';
import UserSearchResults from '../components/search/UserSearchResults.tsx';

export default function Search() {
    const [query, setQuery] = useState('');
    const [users, setUsers] = useState<UserListItem[]>([]);
    const [meId, setMeId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let ignore = false;

        Promise.all([
            getUsers().catch(() => [] as UserListItem[]),
            getMe().catch(() => undefined),
        ])
            .then(([fetchedUsers, me]) => {
                if (ignore) return;
                setUsers(fetchedUsers);
                setMeId(me?.id ?? null);
            })
            .finally(() => {
                if (!ignore) setLoading(false);
            });

        return () => {
            ignore = true;
        };
    }, []);

    const normalizedQuery = useMemo(() => query.trim().toLowerCase(), [query]);

    const usersSortedAlphabetically = useMemo(() => {
        return [...users].sort((a, b) =>
            a.username.localeCompare(b.username, undefined, {
                sensitivity: 'base',
            }),
        );
    }, [users]);

    const displayedUsers = useMemo(() => {
        if (normalizedQuery.length === 0) return usersSortedAlphabetically;

        return usersSortedAlphabetically.filter((u) =>
            u.username.toLowerCase().includes(normalizedQuery),
        );
    }, [normalizedQuery, usersSortedAlphabetically]);

    if (loading) return <p className="p-4">Loading…</p>;

    return (
        <div className="p-4 max-w-3xl mx-auto space-y-6">
            {/* Search bar */}
            <div className="rounded bg-gray-100 dark:bg-dark p-4">
                <label className="block text-sm font-medium mb-2">Search</label>
                <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search users or images…"
                    className="w-full border rounded p-3 bg-white dark:bg-dark"
                />
            </div>

            {/* Results */}
            <div className="rounded bg-gray-100 dark:bg-dark p-4">
                <div className="text-sm font-medium mb-4">Results</div>

                <div className="text-base font-semibold">
                    <ImageSearchResults query={query} />
                </div>

                {query.trim().length > 0 && (
                    <hr className="my-4 border-gray-300 dark:border-gray-700" />
                )}

                <UserSearchResults users={displayedUsers} meId={meId} />
            </div>
        </div>
    );
}
