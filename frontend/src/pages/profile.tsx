import { useEffect, useMemo, useState } from 'react';
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
    const [showLoading, setShowLoading] = useState(false);

    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const isMyProfile = useMemo(() => !userId, [userId]);

    useEffect(() => {
        let ignore = false;
        const timer = setTimeout(() => {
            if (!ignore) setShowLoading(true);
        }, 300);

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
                if (!ignore) {
                    setLoading(false);
                    setShowLoading(false);
                }
            }
        };

        fetchData();
        return () => {
            ignore = true;
            clearTimeout(timer);
        };
    }, [userId, isMyProfile]);

    const refreshImages = async () => {
        if (!user) return;
        const imgs = await getUserImages(user.id);
        setImages(imgs);
    };

    const refreshUser = async () => {
        const updated = await getMe();
        setUser(updated);
    };

    if (loading && showLoading) return <p>Loading…</p>;
    if (showLoading && !user) return <p>No user found</p>;

    if (user)
        return (
            <div className="pb-10">
                <ProfileInfo
                    user={user}
                    isMyProfile={isMyProfile}
                    onUserUpdated={refreshUser}
                />

                {isMyProfile && (
                    <div className="flex justify-center mb-4">
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(true)}
                            className="px-4 py-2 rounded-full bg-dark-gray text-white border border-gray-500 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
                        >
                            <span className="mr-3 font-bold">+</span> Create
                            post
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
                        onClose={() => setIsCreateModalOpen(false)}
                        onCreated={refreshImages}
                    />
                )}

                {selectedImageId && (
                    <ImageModal
                        imageId={selectedImageId}
                        onClose={() => setSelectedImageId(null)}
                        onDeleted={refreshImages}
                        onUpdated={refreshImages}
                    />
                )}
            </div>
        );
};

export default Profile;
