import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { getMe, getUser } from '../api/users/usersService';
import { getUserImages } from '../api/images/imagesService';
import type { MyUser, UserProfile } from '../types/user';
import ProfileInfo from '../components/profile/ProfileInfo.tsx';
import UserGallery from '../components/image/Gallery/UserGallery.tsx';
import ImageModal from '../components/image/ImageModal/ImageModal.tsx';
import type { Logger } from '../logger/logger.interface.ts';
import { useLogger } from '../logger/logger.context.tsx';
import { useImages } from '../context/ImagesContext.tsx';

const Profile = () => {
    const logger = useRef<Logger>(useLogger());
    const { userId } = useParams();
    const { images, setImages } = useImages();
    const [user, setUser] = useState<MyUser | UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [showLoading, setShowLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [ready, setReady] = useState(false);
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const isMyProfile = useMemo(() => !userId, [userId]);
    const loaderRef = useRef<HTMLDivElement>(null);
    const pageRef = useRef(1);
    const hasMoreRef = useRef(true);
    const isLoadingMore = useRef(false);
    const userIdRef = useRef<string | null>(null);

    const updateHasMore = (more: boolean) => {
        setHasMore(more);
        hasMoreRef.current = more;
    };

    const loadMoreRef = useRef(async () => {
        if (isLoadingMore.current || !hasMoreRef.current || !userIdRef.current)
            return;
        isLoadingMore.current = true;
        try {
            const nextPage = pageRef.current + 1;
            const { images: imgs, hasMore: more } = await getUserImages(
                userIdRef.current,
                nextPage,
            );
            setImages((prev) => [...prev, ...imgs]);
            updateHasMore(more);
            pageRef.current = nextPage;
        } finally {
            isLoadingMore.current = false;
        }
    });

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
                if (!nextUser || ignore) return;

                userIdRef.current = nextUser.id;
                const { images: nextImages, hasMore: more } =
                    await getUserImages(nextUser.id, 1);
                if (ignore) return;

                setUser(nextUser);
                setImages(nextImages);
                updateHasMore(more);
                pageRef.current = 1;
                logger.current.info(`User ${nextUser.id} opened its profile`);
            } finally {
                if (!ignore) {
                    setLoading(false);
                    setShowLoading(false);
                    setReady(true);
                }
            }
        };

        setReady(false);
        fetchData();

        return () => {
            ignore = true;
            clearTimeout(timer);
            setImages([]);
        };
    }, [userId, isMyProfile, setImages]);

    useEffect(() => {
        if (!ready || !loaderRef.current) return;
        const node = loaderRef.current;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) loadMoreRef.current();
            },
            { threshold: 0.1 },
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [ready]);

    const refreshImages = async () => {
        if (!userIdRef.current) return;
        const { images: imgs, hasMore: more } = await getUserImages(
            userIdRef.current,
            1,
        );
        setImages(imgs);
        updateHasMore(more);
        pageRef.current = 1;
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

                <div
                    ref={loaderRef}
                    className="py-4 text-center text-dark-gray text-sm"
                >
                    {hasMore ? 'Loading...' : 'No other post'}
                </div>

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
