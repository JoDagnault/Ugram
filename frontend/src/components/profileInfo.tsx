import type { MyUser } from '../types/user';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
});

type Props = {
    user: MyUser;
};

const ProfileInfo = ({ user }: Props) => {
    return (
        <div className="p-3 mb-5 flex flex-wrap w-full justify-center">
            <img
                src={user.profilePictureUrl}
                alt={`${user.username} profile`}
                className="w-25 h-25 rounded-full object-cover mx-8 my-2"
            />

            <div>
                <h1 className="text-lg font-bold my-2">{user.username}</h1>
                <p>
                    {user.firstName} {user.lastName}
                </p>
                <p>{user.email}</p>
                <p>{user.phone}</p>
                <p>
                    Member since{' '}
                    {dateFormatter.format(new Date(user.createdAt))}
                </p>
            </div>
        </div>
    );
};

export default ProfileInfo;
