import type { ImageListItem } from '../../../types/image';
import GalleryImageCard from './GalleryImageCard.tsx';

type Props = {
    images: ImageListItem[];
    onImageClick: (imageId: string) => void;
};

const UserGallery = ({ images, onImageClick }: Props) => {
    if (images.length === 0) {
        return <p>No posts yet</p>;
    }

    return (
        <div className="w-full flex justify-center">
            <div className="grid grid-cols-3 gap-1 max-w-300">
                {images.map((image) => (
                    <GalleryImageCard
                        key={image.id}
                        image={image}
                        onClick={onImageClick}
                    />
                ))}
            </div>
        </div>
    );
};

export default UserGallery;
