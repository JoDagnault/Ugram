import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useMatch } from 'react-router';
import { getMe, getUsers } from '../api/users/usersService';
import type { UserListItem } from '../types/user';
import ImageSearchResults from '../components/search/ImageSearchResults.tsx';
import UserSearchResults from '../components/search/UserSearchResults.tsx';
import * as Sentry from '@sentry/react';

export default function Search() {
    const location = useLocation();
    const onResultsPage = useMatch('/Search/results');

    const [query, setQuery] = useState(() => {
        const params = new URLSearchParams(location.search);
        return params.get('q')?.trim() ?? '';
    });

    const [users, setUsers] = useState<UserListItem[]>([]);
    const [meId, setMeId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setQuery(params.get('q')?.trim() ?? '');
    }, [location.search]);

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
                Sentry.logger.info(`User ${me!.id} opened search page`);
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
        <div className="flex">
            <div
                className={`${
                    onResultsPage
                        ? 'w-96 shrink-0 border-r border-gray-200 dark:border-gray-700'
                        : 'w-full max-w-3xl mx-auto'
                } p-4 space-y-6`}
            >
                <div className="rounded bg-gray-100 dark:bg-dark p-4">
                    <label className="block text-sm font-medium mb-2">
                        Search
                    </label>
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search users or images…"
                        className="w-full border rounded p-3 bg-white dark:bg-dark"
                    />
                </div>

                <div className="rounded bg-gray-100 dark:bg-dark p-4">
                    <div className="text-sm font-medium mb-4">Results</div>

                    <div className="text-base font-semibold">
                        <ImageSearchResults query={query} />
                    </div>

                    {query.trim().length > 0 && (
                        <hr className="my-4 border-gray-300 dark:border-gray-700" />
                    )}

                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Users
                    </div>
                    <UserSearchResults users={displayedUsers} meId={meId} />
                </div>
            </div>

            <div className={onResultsPage ? 'flex-1 min-w-0' : 'hidden'}>
                <Outlet />
            </div>
        </div>
    );
}
