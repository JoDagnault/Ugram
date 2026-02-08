import { Link } from 'react-router';
import type { UserListItem } from '../types/user';

type Props = {
    users: UserListItem[];
};

export default function UserSearchResults({ users }: Props) {
    if (users.length === 0) {
        return <p>No users found</p>;
    }

    return (
        <div className="mt-4 space-y-2">
            {users.map((u) => (
                <Link
                    key={u.id}
                    to={`/profile/${u.id}`}
                    className="flex items-center gap-3 border-b pb-2 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                    <img
                        src={u.profilePictureUrl}
                        alt={`@${u.username}`}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-semibold">@{u.username}</span>
                </Link>
            ))}
        </div>
    );
}
