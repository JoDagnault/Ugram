import type { ImageDetails } from '../types/image';

type Props = {
    image: ImageDetails;
};

const imageCard = ({ image }: Props) => {
    return (
        <div className="border rounded overflow-hidden shadow-sm">
            <img
                src={image.imageUrl}
                alt={image.id}
                className="w-full object-cover"
            />
            <div className="p-3 space-y-1 text-sm">
                <div className="text-gray-500 text-xs">
                    {new Date(image.createdAt).toLocaleDateString()}
                </div>
                {image.description && (
                    <p className="text-sm">{image.description}</p>
                )}
                {image.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {image.hashtags.map((h) => (
                            <span key={h} className="text-blue-500">
                                #{h}
                            </span>
                        ))}
                    </div>
                )}
                {image.mentionUserIds.length > 0 && (
                    <div className="flex gap-2">
                        {image.mentionUserIds.map((id) => (
                            <span key={id} className="text-blue-500">
                                @{id}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default imageCard;
