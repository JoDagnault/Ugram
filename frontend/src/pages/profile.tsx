import { useEffect, useState } from 'react';
import { getMe } from '../api/users/usersService.ts';
import type { MyUser } from '../types/user.ts';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
});

const Profile = () => {
    const [me, setMe] = useState<MyUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let ignore = false;
        getMe()
            .then((result) => {
                if (!ignore) {
                    setMe(result);
                }
            })
            .finally(() => {
                if (!ignore) {
                    setLoading(false);
                }
            });

        return () => {
            ignore = true;
        };
    }, []);

    if (loading) return <p>Loading..</p>;
    if (!me) return <p>No user found</p>;

    return (
        <div className="p-3 mt-1">
            <h1 className="mb-1 text-lg">Profile</h1>
            <p>Username : {me.username}</p>
            <p>
                Name : {me.firstName} {me.lastName}
            </p>
            <p>Email : {me.email}</p>
            <p>Phone : {me.phone}</p>
            <p>Member since : {dateFormatter.format(new Date(me.createdAt))}</p>
        </div>
    );
};

export default Profile;
