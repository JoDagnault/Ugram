import { useEffect, useMemo, useState } from 'react';
import { getFeedImages } from '../api/images/imagesService';
import { getMe } from '../api/users/usersService';
import type { ImageDetails } from '../types/image';
import type { MyUser } from '../types/user';
import ImageCard from '../components/imageCard.tsx';
import ImageModal from '../components/imageModal.tsx';

const Home = () => {
    const [images, setImages] = useState<ImageDetails[]>([]);
    const [me, setMe] = useState<MyUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedImage, setSelectedImage] = useState<ImageDetails | null>(
        null,
    );

    const loadFeed = async () => {
        try {
            const [currentMe, feedImages] = await Promise.all([
                getMe(),
                getFeedImages(),
            ]);

            setMe(currentMe);
            setImages(feedImages);
        } catch (error) {
            console.error('Failed to load feed', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadFeed();
    }, []);

    const isOwner = useMemo(() => {
        if (!me || !selectedImage) return false;
        return selectedImage.userId === me.id;
    }, [me, selectedImage]);

    const refreshFeed = async () => {
        try {
            const feedImages = await getFeedImages();
            setImages(feedImages);
        } catch (error) {
            console.error('Failed to refresh feed', error);
        }
    };

    if (isLoading) {
        return <p className="p-4">Loading feed…</p>;
    }

    if (images.length === 0) {
        return <p className="p-4">No images to display.</p>;
    }

    return (
        <div className="space-y-6 p-4 max-w-3xl mx-auto">
            {images.map((image) => (
                <div
                    key={image.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedImage(image)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            setSelectedImage(image);
                        }
                    }}
                    className="cursor-pointer"
                    title="Open image"
                >
                    <ImageCard image={image} />
                </div>
            ))}

            {selectedImage && (
                <ImageModal
                    imageId={selectedImage.id}
                    isOwner={isOwner}
                    onClose={() => setSelectedImage(null)}
                    onDeleted={() => {
                        setSelectedImage(null);
                        refreshFeed();
                    }}
                    onUpdated={() => {
                        refreshFeed();
                    }}
                />
            )}
        </div>
    );
};

export default Home;
