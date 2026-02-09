import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getMe, getUser } from '../api/users/usersService';
import { getUserImages } from '../api/images/imagesService';
import type { MyUser, UserProfile } from '../types/user';
import type { ImageListItem } from '../types/image';

import ProfileInfo from '../components/profileInfo.tsx';
import UserGallery from '../components/userGallery.tsx';
import ImageModal from '../components/imageModal.tsx';

const Profile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState<MyUser | UserProfile | null>(null);
    const [images, setImages] = useState<ImageListItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

    const isMyProfile = !userId;

    useEffect(() => {
        let ignore = false;

        const fetchData = async () => {
            try {
                if (isMyProfile) {
                    const me = await getMe();
                    if (!ignore) {
                        setUser(me);
                        const imgs = await getUserImages(me.id);
                        setImages(imgs);
                    }
                } else {
                    const otherUser = await getUser(userId);
                    if (!ignore && otherUser) {
                        setUser(otherUser);
                        const imgs = await getUserImages(otherUser.id);
                        setImages(imgs);
                    }
                }
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

            <UserGallery
                images={images}
                onImageClick={(id) => setSelectedImageId(id)}
            />

            {selectedImageId && (
                <ImageModal
                    imageId={selectedImageId}
                    isOwner={isMyProfile}
                    onClose={() => setSelectedImageId(null)}
                    onDeleted={() => refreshImages()}
                    onUpdated={() => refreshImages()}
                />
            )}
        </div>
    );
};

export default Profile;
