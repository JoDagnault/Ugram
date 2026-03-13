import type { MyUser, UserProfile } from '../../types/user';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import EditProfileModal from './EditProfileModal.tsx';
import { updateMe } from '../../api/users/usersService.ts';
import * as Sentry from '@sentry/react';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
});

type Props = {
    user: MyUser | UserProfile;
    isMyProfile: boolean;
    onUserUpdated?: () => void;
};

const ProfileInfo = ({ user, isMyProfile, onUserUpdated }: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(user);
    const [updateError, setUpdateError] = useState<string | null>(null);

    useEffect(() => {
        setCurrentUser(user);
    }, [user]);

    const handleUpdateProfile = async (updatedUser: MyUser) => {
        try {
            const savedUser = await updateMe(updatedUser);
            setCurrentUser(savedUser);
            onUserUpdated?.();
            setIsModalOpen(false);
            Sentry.logger.info(`User ${savedUser.id} updated`);
        } catch (error: any) {
            Sentry.logger.warn('User updated failed');
            setUpdateError(error.message);
        }
    };

    return (
        <>
            <div className="p-3 mb-5 flex flex-wrap w-full justify-center">
                <img
                    src={user.profilePictureUrl}
                    alt={`${user.username} profile`}
                    className="w-25 h-25 rounded-full object-cover mx-8 my-2"
                />

                <div className="flex flex-col">
                    <div className="flex justify-center sm:justify-between mt-2">
                        <h1 className="text-lg font-bold mr-1">
                            {user.username}
                        </h1>

                        {isMyProfile && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="p-1"
                            >
                                <PencilSquareIcon className="size-5 hover:text-accent" />
                            </button>
                        )}
                    </div>

                    <div className="mt-3">
                        {isMyProfile && 'email' in currentUser && (
                            <>
                                <p>
                                    {currentUser.firstName}{' '}
                                    {currentUser.lastName}
                                </p>
                                <p>{currentUser.email}</p>
                                <p>{currentUser.phoneNumber}</p>
                            </>
                        )}

                        <p>
                            Member since{' '}
                            {dateFormatter.format(new Date(user.createdAt))}
                        </p>
                    </div>
                </div>
            </div>

            {isMyProfile && isModalOpen && 'email' in currentUser && (
                <EditProfileModal
                    user={currentUser}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleUpdateProfile}
                    onDelete={() => {
                        localStorage.removeItem('jwt');
                        window.location.href = '/login';
                    }}
                    error={updateError}
                />
            )}
        </>
    );
};

export default ProfileInfo;
