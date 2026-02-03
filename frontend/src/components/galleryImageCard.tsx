import type { ImageListItem } from '../types/image';

type Props = {
    image: ImageListItem;
};

const GalleryImageCard = ({ image }: Props) => {
    return (
        <div className="aspect-square overflow-hidden">
            <img
                src={image.imageUrl}
                alt={image.id}
                className="w-full h-full object-cover"
            />
        </div>
    );
};

export default GalleryImageCard;
