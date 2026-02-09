import type { ImageListItem } from '../types/image';

type Props = {
    image: ImageListItem;
    onClick: (imageId: string) => void;
};

const GalleryImageCard = ({ image, onClick }: Props) => {
    return (
        <button
            type="button"
            onClick={() => onClick(image.id)}
            className="aspect-square overflow-hidden cursor-pointer"
            title="Open image"
        >
            <img
                src={image.imageUrl}
                alt={image.id}
                className="w-full h-full object-cover"
            />
        </button>
    );
};

export default GalleryImageCard;
