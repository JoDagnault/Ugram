import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getMe, getUser } from '../api/users/usersService';
import { getUserImages } from '../api/images/imagesService';
import type { MyUser, UserProfile } from '../types/user';
import type { ImageListItem } from '../types/image';

import ProfileInfo from '../components/profile/ProfileInfo.tsx';
import UserGallery from '../components/image/Gallery/UserGallery.tsx';
import ImageModal from '../components/image/ImageModal/ImageModal.tsx';

const Profile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState<MyUser | UserProfile | null>(null);
    const [images, setImages] = useState<ImageListItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const isMyProfile = !userId;

    useEffect(() => {
        let ignore = false;

        const fetchData = async () => {
            try {
                const nextUser = isMyProfile
                    ? await getMe()
                    : await getUser(userId!);
                if (!nextUser) return;

                const nextImages = await getUserImages(nextUser.id);
                if (ignore) return;

                setUser(nextUser);
                setImages(nextImages);
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        fetchData();
        return () => {
            ignore = true;
        };
    }, [userId, isMyProfile]);

    const refreshImages = async () => {
        if (!user) return;
        const imgs = await getUserImages(user.id);
        setImages(imgs);
    };

    if (loading) return <p>Loading…</p>;
    if (!user) return <p>No user found</p>;

    return (
        <div>
            <ProfileInfo user={user} isMyProfile={isMyProfile} />

            {isMyProfile && (
                <div className="flex justify-center mb-4">
                    <button
                        type="button"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-4 py-2 rounded bg-dark-gray text-white hover:bg-accent"
                    >
                        Create post
                    </button>
                </div>
            )}

            <UserGallery
                images={images}
                onImageClick={(id) => setSelectedImageId(id)}
            />

            {isMyProfile && isCreateModalOpen && (
                <ImageModal
                    mode="create"
                    isOwner={isMyProfile}
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreated={refreshImages}
                />
            )}

            {selectedImageId && (
                <ImageModal
                    imageId={selectedImageId}
                    isOwner={isMyProfile}
                    onClose={() => setSelectedImageId(null)}
                    onDeleted={refreshImages}
                    onUpdated={refreshImages}
                />
            )}
        </div>
    );
};

export default Profile;
