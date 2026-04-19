'use client';

import React, { useState } from 'react';
import { BookmarkIcon } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { useUserContext } from '@/app/contexts/UserContext';
import { getAuthToken } from '@/app/contexts/auth';

interface BookmarkToggleProps {
    eventId: number;
    initialIsBookmarked: boolean;
    initialCount: number;
    isHost: boolean;
}

export default function BookmarkToggle({ eventId, initialIsBookmarked, initialCount, isHost }: BookmarkToggleProps) {
    const { user } = useUserContext();
    const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
    const [count, setCount] = useState(initialCount);
    const [isLoading, setIsLoading] = useState(false);

    if (isHost) {
        return (
            <div className="flex items-center gap-2 text-slate-500">
                <BookmarkIcon size={20} />
                <span className="text-sm font-medium">{count}</span>
            </div>
        );
    }

    const handleToggle = async () => {
        if (!user) {
            return;
        }

        const prevIsBookmarked = isBookmarked;
        const prevCount = count;

        setIsBookmarked(!prevIsBookmarked);
        setCount(prevIsBookmarked ? Math.max(0, prevCount - 1) : prevCount + 1);
        setIsLoading(true);

        try {
            const token = await getAuthToken();
            const endpoint = prevIsBookmarked ? 'delete-favorite' : 'add-favorite';
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/bookmark/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `bearer ${token}`
                },
                body: JSON.stringify({ eventId })
            });

            if (!response.ok) throw new Error();

        } catch (error) {
            setIsBookmarked(prevIsBookmarked);
            setCount(prevCount);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Toggle
                aria-label="Toggle bookmark"
                pressed={isBookmarked}
                onPressedChange={handleToggle}
                disabled={isLoading}
                className="p-2 h-8 w-8 data-[state=on]:bg-slate-100"
            >
                <BookmarkIcon
                    size={20}
                    className={isBookmarked ? "fill-slate-900 text-slate-500" : "text-slate-500"}
                />
            </Toggle>
            <span className="text-sm font-medium text-slate-500">{count}</span>
        </div>
    );
}
