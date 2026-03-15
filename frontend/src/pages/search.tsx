import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useMatch, useNavigate } from 'react-router';
import { getMe, getUsers } from '../api/users/usersService';
import type { UserListItem } from '../types/user';
import ImageSearchResults from '../components/search/ImageSearchResults.tsx';
import UserSearchResults from '../components/search/UserSearchResults.tsx';
import * as Sentry from '@sentry/react';

export default function Search() {
    const location = useLocation();
    const navigate = useNavigate();
    const onResultsPage = useMatch('/Search/results');
    const getCurrentTab = () => {
        const params = new URLSearchParams(location.search);
        return params.get('tab') ?? 'hashtags';
    };

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
        <div className="flex overflow-y-auto flex-col min-[1242px]:flex-row min-[1242px]: h-[calc(100vh-4rem)]">
            <div
                className={`${
                    onResultsPage
                        ? 'hidden min-[1242px]:block min-[1242px]:w-96 min-[1242px]:shrink-0 min-[1242px]:border-r border-gray-700'
                        : 'w-full max-w-3xl mx-auto'
                } p-4 space-y-6 min-[1242px]:overflow-y-auto min-[1242px]:h-full`}
            >
                <div className="rounded p-4">
                    <label className="block text-sm font-medium mb-2">
                        Search
                    </label>
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && query.trim()) {
                                navigate(
                                    `/Search/results?q=${encodeURIComponent(query.trim())}&tab=${getCurrentTab()}`,
                                );
                            }
                        }}
                        placeholder="Search users or posts…"
                        className="w-full border rounded p-3"
                    />
                </div>

                <div className="rounde p-4">
                    <div className="text-sm font-medium mb-4">Results</div>

                    <div className="text-base font-semibold">
                        <ImageSearchResults postResults={query} />
                    </div>

                    {query.trim().length > 0 && (
                        <hr className="my-4 border-gray-700" />
                    )}

                    <div className="font-semibold text-sm text-gray-400 truncate mt-4 mb-2">
                        {normalizedQuery.length === 0
                            ? 'All users'
                            : `Users matching "${query}"`}
                    </div>
                    <UserSearchResults users={displayedUsers} meId={meId} />
                </div>
            </div>

            <div
                className={
                    onResultsPage
                        ? 'block min-[1242px]:overflow-y-auto min-[1242px]:h-full flex-1 min-w-0'
                        : 'hidden'
                }
            >
                <Outlet />
            </div>
        </div>
    );
}
