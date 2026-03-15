import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import type { ImageDetails } from '../types/image';
import ImageCard from '../components/image/ImageCard';
import ImageModal from '../components/image/ImageModal/ImageModal';
import {
    useImageSearchByDescription,
    useImageSearchByHashtag,
} from '../api/images/useImageSearch';

type Tab = 'hashtags' | 'images';

type TabButtonProps = {
    label: string;
    isActive: boolean;
    onClick: () => void;
};

function TabButton({ label, isActive, onClick }: TabButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                isActive
                    ? 'border-b-2 border-accent text-accent'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
        >
            {label}
        </button>
    );
}

export default function SearchResults() {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState<ImageDetails | null>(
        null,
    );

    const searchParams = useMemo(
        () => new URLSearchParams(location.search),
        [location.search],
    );

    const query = useMemo(
        () => searchParams.get('q')?.trim() ?? '',
        [searchParams],
    );

    const activeTab = useMemo(
        (): Tab =>
            searchParams.get('tab') === 'images' ? 'images' : 'hashtags',
        [searchParams],
    );

    const switchTab = (tab: Tab) => {
        setSelectedImage(null);
        navigate(`/Search/results?q=${encodeURIComponent(query)}&tab=${tab}`, {
            replace: true,
        });
    };

    const { status: hashtagStatus, images: hashtagImages } =
        useImageSearchByHashtag(activeTab === 'hashtags' ? query : '');

    const { status: imageStatus, images: descriptionImages } =
        useImageSearchByDescription(activeTab === 'images' ? query : '');

    const isLoading =
        activeTab === 'hashtags'
            ? hashtagStatus === 'loading'
            : imageStatus === 'loading';

    const images = activeTab === 'hashtags' ? hashtagImages : descriptionImages;

    return (
        <div>
            <div className="px-4 pt-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Search results for
                </p>
                <h1 className="text-lg font-semibold">{query}</h1>
            </div>

            <div className="flex border-b border-gray-300 dark:border-gray-700">
                <TabButton
                    label="Hashtags"
                    isActive={activeTab === 'hashtags'}
                    onClick={() => switchTab('hashtags')}
                />
                <TabButton
                    label="Description"
                    isActive={activeTab === 'images'}
                    onClick={() => switchTab('images')}
                />
            </div>

            <div className="space-y-6 p-4">
                {isLoading ? (
                    <p className="text-sm text-gray-500">Loading images…</p>
                ) : images.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        {activeTab === 'hashtags'
                            ? `No images found with the hashtag #${query}.`
                            : `No images found matching "${query}".`}
                    </p>
                ) : (
                    images.map((image) => (
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
                    ))
                )}
            </div>

            {selectedImage && (
                <ImageModal
                    imageId={selectedImage.id}
                    onClose={() => setSelectedImage(null)}
                    onDeleted={() => setSelectedImage(null)}
                />
            )}
        </div>
    );
}
