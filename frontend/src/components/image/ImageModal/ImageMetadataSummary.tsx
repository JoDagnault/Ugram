const toMentionLabel = (value: string): string =>
    value.startsWith('@') ? value : `@${value}`;

type Props = {
    hashtags: string[];
    mentions: string[];
    publisher: string;
    description?: string;
    userIdToUsername: Map<string, string>;
};

export default function ImageMetadataSummary({
    hashtags,
    mentions,
    publisher,
    description,
    userIdToUsername,
}: Props) {
    const mentionLabels = mentions.map((userId) =>
        toMentionLabel(userIdToUsername.get(userId) ?? userId),
    );

    return (
        <div className="space-y-5">
            {description && publisher && (
                <p className="text-sm break-words text-gray-200">
                    <span className="font-semibold mr-1 text-white">
                        @{publisher} :{' '}
                    </span>
                    {description}
                </p>
            )}

            {!description && publisher && (
                <div className="text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                        published by:{' '}
                    </span>
                    {toMentionLabel(publisher)}
                </div>
            )}

            {hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 text-sm">
                    {hashtags.map((tag) => (
                        <span key={tag} className="text-blue-500 break-all">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {mentionLabels.length > 0 && (
                <div className="text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                        Tagged:{' '}
                    </span>
                    {mentionLabels.join(', ')}
                </div>
            )}
        </div>
    );
}
