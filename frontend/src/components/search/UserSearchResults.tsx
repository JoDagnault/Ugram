import type { UserListItem } from '../../types/user';
import { Link } from 'react-router';

type Props = {
    users: UserListItem[];
    meId?: string | null;
};

export default function UserSearchResults({ users, meId }: Props) {
    if (users.length === 0) {
        return <p className="text-sm text-gray-500">No users found</p>;
    }

    return (
        <div className="space-y-2">
            {users.map((u) => (
                <Link
                    key={u.id}
                    to={u.id === meId ? '/Profile/me' : `/Profile/${u.id}`}
                    className="flex items-center gap-3 border rounded p-2 bg-white dark:bg-dark hover:bg-gray-50 dark:hover:bg-black/20 cursor-pointer"
                    title="Clickable later"
                >
                    <img
                        src={u.profilePictureUrl}
                        alt={`@${u.username}`}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="font-medium">@{u.username}</div>
                </Link>
            ))}
        </div>
    );
}
