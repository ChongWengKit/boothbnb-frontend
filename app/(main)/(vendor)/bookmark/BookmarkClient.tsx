'use client';

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import EventResultsList from "@/app/(main)/(public)/components/EventResultsList";
import Pagination from "@/components/Pagination";
import type { Event } from "@/app/(main)/(vendor)/hooks/useBookmarks";
import { useToggleBookmark} from "@/app/(main)/(vendor)/hooks/useToggleBookmark";

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
    const { toggleBookmark } = useToggleBookmark();
    
    useEffect(() => {

        const hasContentChanged = initialBookmarks.length !== lastProcessedInitialBookmarksRef.current.length ||
                                  initialBookmarks.some((event, index) => event.id !== lastProcessedInitialBookmarksRef.current[index]?.id);

        if (hasContentChanged) {
            setBookmarks(initialBookmarks);
            lastProcessedInitialBookmarksRef.current = initialBookmarks; 
        }
    }, [initialBookmarks]); 

    const handleToggleBookmark = async (eventToToggle: Event) => {

        const originalBookmarks = [...bookmarks];
        
        setBookmarks(prev => prev.filter(b => b.id !== eventToToggle.id));

        try {
            await toggleBookmark(eventToToggle, true);
        } catch (error) {
            console.error(error);
            toast.error('Failed to update bookmark');
            setBookmarks(originalBookmarks);
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
                bookmarks={bookmarks}
                onToggleBookmark={handleToggleBookmark}
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