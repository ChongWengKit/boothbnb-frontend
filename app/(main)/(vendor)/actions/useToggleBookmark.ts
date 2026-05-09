'use client'

import { useState } from 'react';
import toast from 'react-hot-toast';
import type { Event } from '@/app/(main)/(vendor)/actions/useBookmarks';
import { getAuthToken, validateResponse } from '@/app/contexts/auth';
export const useToggleBookmark = () => {
  const [isToggling, setIsToggling] = useState(false);

  const toggleBookmark = async (event: Event, isCurrentlyBookmarked: boolean) => {
    setIsToggling(true);
    try {
      const token = await getAuthToken();
      const endpoint = isCurrentlyBookmarked ? 'delete-favorite' : 'add-favorite';
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/bookmark/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`,
        },
        body: JSON.stringify({ eventId: event.id }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'API request failed');
      }

      toast.success(isCurrentlyBookmarked ? "Bookmark removed." : "Bookmark added.");
    } catch (error) {

    } finally {
      setIsToggling(false);
    }
  };

  return { isToggling, toggleBookmark };
};
