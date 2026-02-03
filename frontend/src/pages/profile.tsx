import { useEffect, useState } from 'react';
import { getMe } from '../api/users/usersService';
import { getUserImages } from '../api/images/imagesService';
import type { MyUser } from '../types/user';
import type { ImageListItem } from '../types/image';

import ProfileInfo from '../components/profileInfo.tsx';
import UserGallery from '../components/userGallery.tsx';

const Profile = () => {
    const [me, setMe] = useState<MyUser | null>(null);
    const [images, setImages] = useState<ImageListItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let ignore = false;

        Promise.all([getMe()])
            .then(([user]) => {
                if (!ignore) {
                    setMe(user);
                    return getUserImages(user.id);
                }
            })
            .then((imgs) => {
                if (!ignore && imgs) {
                    setImages(imgs);
                }
            })
            .finally(() => {
                if (!ignore) setLoading(false);
            });

        return () => {
            ignore = true;
        };
    }, []);

    if (loading) return <p>Loading…</p>;
    if (!me) return <p>No user found</p>;

    return (
        <div>
            <ProfileInfo user={me} />
            <UserGallery images={images} />
        </div>
    );
};

export default Profile;
