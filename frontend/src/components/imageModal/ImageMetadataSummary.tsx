const toMentionLabel = (value: string): string =>
    value.startsWith('@') ? value : `@${value}`;

type Props = {
    hashtags: string[];
    mentionUserIds: string[];
    userIdToUsername: Map<string, string>;
};

export default function ImageMetadataSummary({
    hashtags,
    mentionUserIds,
    userIdToUsername,
}: Props) {
    const mentionLabels = mentionUserIds.map((userId) =>
        toMentionLabel(userIdToUsername.get(userId) ?? userId),
    );

    return (
        <div className="space-y-3">
            {hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {hashtags.map((tag) => (
                        <span key={tag} className="text-blue-500">
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
