'use client';

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EventResultsList from "@/app/(main)/(public)/components/EventResultsList";
import Pagination from "@/components/Pagination";
import type { Event } from "@/app/(main)/(vendor)/actions/useBookmarks";

interface PaginationMeta {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

interface BookmarkClientProps {
    initialBookmarks: Event[];
    paginationMeta?: PaginationMeta;
}

const BookmarkClient: React.FC<BookmarkClientProps> = ({ initialBookmarks, paginationMeta }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [bookmarks, setBookmarks] = useState<Event[]>(() => initialBookmarks);
    const lastProcessedInitialBookmarksRef = React.useRef<Event[]>(initialBookmarks);

    useEffect(() => {

        const hasContentChanged = initialBookmarks.length !== lastProcessedInitialBookmarksRef.current.length ||
                                  initialBookmarks.some((event, index) => event.id !== lastProcessedInitialBookmarksRef.current[index]?.id);

        if (hasContentChanged) {
            setBookmarks(initialBookmarks);
            lastProcessedInitialBookmarksRef.current = initialBookmarks; 
        }
    }, [initialBookmarks]); 

    const handleBookmarkChange = (eventToToggle: Event, isNowBookmarked: boolean) => {
        if (!isNowBookmarked) {
            setBookmarks(prev => prev.filter(b => b.id !== eventToToggle.id));
        }
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
    };

    return (
        <>
            <EventResultsList
                events={bookmarks}
                isLoading={false}
                emptyTitle="No bookmarks found"
                emptySubtitle="Try bookmarking some events."
                title="Your Bookmarks"
                enableBookmark
                onBookmarkChange={handleBookmarkChange}
            />
            {paginationMeta && (
                <Pagination
                    currentPage={paginationMeta.currentPage}
                    totalPages={paginationMeta.totalPages}
                    onPageChange={handlePageChange}
                    hasNextPage={paginationMeta.hasNextPage}
                    hasPreviousPage={paginationMeta.hasPreviousPage}
                />
            )}
        </>
    );
};

export default BookmarkClient;