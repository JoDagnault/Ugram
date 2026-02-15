import { useMemo, useState } from 'react';
import type { UserListItem } from '../../../types/user.ts';

const MAX_MENTION_SUGGESTIONS = 5;

type Props = {
    initialMentions: string[];
    users: UserListItem[];
};

export default function useMentionEditor({ initialMentions, users }: Props) {
    const [mentions, setMentions] = useState<string[]>(initialMentions);
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

        const selectedMentions = new Set(mentions);
        return usersSortedAlphabetically
            .filter(
                (user) =>
                    !selectedMentions.has(user.id) &&
                    user.username.toLowerCase().includes(mentionQuery),
            )
            .slice(0, MAX_MENTION_SUGGESTIONS);
    }, [mentionQuery, mentions, usersSortedAlphabetically]);

    const addMention = (userId: string) => {
        setMentions((current) =>
            current.includes(userId) ? current : [...current, userId],
        );
        setMentionsInput('');
    };

    const removeMention = (userId: string) => {
        setMentions((current) => current.filter((value) => value !== userId));
    };

    return {
        mentions,
        mentionsInput,
        setMentionsInput,
        mentionSuggestions,
        addMention,
        removeMention,
    };
}
