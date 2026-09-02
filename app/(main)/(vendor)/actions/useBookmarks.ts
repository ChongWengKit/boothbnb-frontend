'use client'
import { useState, useEffect } from 'react';
import { getAuthToken, validateResponse } from '@/app/contexts/auth';
export interface Event {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  address: string;
  thumbnail: string | null;
  slug: string;
  total_bookings: number;
  total_capacity: number;
  available_booths: number;
  latitude: number;
  longitude: number;
  is_bookmarked?: boolean;
}

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Event[]>([]);
  const [isBookmarksLoading, setIsBookmarksLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      setIsBookmarksLoading(true);
      try {
        const token = await getAuthToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/bookmark/favorite`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${token}`,
          },
        });
                if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch bookmarks');
        }
        const data = await response.json();
        setBookmarks(data.data || []);
      } catch (error) {
        setBookmarks([]);
      } finally {
        setIsBookmarksLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  return { bookmarks, isBookmarksLoading, setBookmarks };
};
