import type { ImageDetails } from '../types/image';

type Props = {
    image: ImageDetails;
};

const FeedImageCard = ({ image }: Props) => {
    return (
        <div className="w-full max-w-[600px] mb-8">
            <img
                src={image.imageUrl}
                alt={image.id}
                className="w-full object-cover rounded"
            />

            <div className="mt-2 text-sm text-gray-500">
                {new Date(image.createdAt).toLocaleDateString()}
            </div>

            {image.description && <p className="mt-1">{image.description}</p>}
        </div>
    );
};

export default FeedImageCard;
