import { useMemo, useState } from 'react';
import type { UserListItem } from '../../../types/user.ts';

const MAX_MENTION_SUGGESTIONS = 5;

type Props = {
    initialMentionUserIds: string[];
    users: UserListItem[];
};

export default function useMentionEditor({
    initialMentionUserIds,
    users,
}: Props) {
    const [mentionUserIds, setMentionUserIds] = useState<string[]>(
        initialMentionUserIds,
    );
    const [mentionsInput, setMentionsInput] = useState('');

    const usersSortedAlphabetically = useMemo(
        () =>
            [...users].sort((a, b) =>
                a.username.localeCompare(b.username, undefined, {
                    sensitivity: 'base',
                }),
            ),
        [users],
    );

    const mentionQuery = mentionsInput.trim().replace(/^@/, '').toLowerCase();

    const mentionSuggestions = useMemo(() => {
        if (!mentionQuery) return [];

        const selectedMentionUserIds = new Set(mentionUserIds);
        return usersSortedAlphabetically
            .filter(
                (user) =>
                    !selectedMentionUserIds.has(user.id) &&
                    user.username.toLowerCase().includes(mentionQuery),
            )
            .slice(0, MAX_MENTION_SUGGESTIONS);
    }, [mentionQuery, mentionUserIds, usersSortedAlphabetically]);

    const addMention = (userId: string) => {
        setMentionUserIds((current) =>
            current.includes(userId) ? current : [...current, userId],
        );
        setMentionsInput('');
    };

    const removeMention = (userId: string) => {
        setMentionUserIds((current) =>
            current.filter((value) => value !== userId),
        );
    };

    return {
        mentionUserIds,
        mentionsInput,
        setMentionsInput,
        mentionSuggestions,
        addMention,
        removeMention,
    };
}
