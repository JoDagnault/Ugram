import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getMe, getUser } from '../api/users/usersService';
import { getUserImages } from '../api/images/imagesService';
import type { MyUser, UserProfile } from '../types/user';
import type { ImageListItem } from '../types/image';

import ProfileInfo from '../components/profileInfo.tsx';
import UserGallery from '../components/userGallery.tsx';

const Profile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState<MyUser | UserProfile | null>(null);
    const [images, setImages] = useState<ImageListItem[]>([]);
    const [loading, setLoading] = useState(true);
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

    if (loading) return <p>Loading…</p>;
    if (!user) return <p>No user found</p>;

    return (
        <div>
            <ProfileInfo user={user} isMyProfile={isMyProfile} />
            <UserGallery images={images} />
        </div>
    );
};

export default Profile;
