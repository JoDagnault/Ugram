import { useEffect, useState } from 'react';
import { getFeedImages } from '../api/images/imagesService';
import type { ImageDetails } from '../types/image';
import FeedImageCard from '../components/feedImageCard';

const Home = () => {
    const [images, setImages] = useState<ImageDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Loads feed images from the image service
     * For now, images are hardcoded and already sorted by date
     */
    const loadFeedImages = async () => {
        try {
            const feedImages = await getFeedImages();
            setImages(feedImages);
        } catch (error) {
            console.error('Failed to load feed images', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadFeedImages();
    }, []);

    if (isLoading) {
        return <p className="p-4">Loading feed…</p>;
    }

    if (images.length === 0) {
        return <p className="p-4">No images to display.</p>;
    }

    return (
        <div className="flex flex-col items-center mt-6 gap-6">
            {images.map((image) => (
                <FeedImageCard key={image.id} image={image} />
            ))}
        </div>
    );
};

export default Home;
