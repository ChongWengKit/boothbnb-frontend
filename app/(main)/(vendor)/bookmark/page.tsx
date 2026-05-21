import React from "react";
import { cookies } from "next/headers";
import { getAuthToken, validateResponse } from "@/app/contexts/auth";
import BookmarkClient from "./BookmarkClient";
import type { Event } from "@/app/(main)/(vendor)/actions/useBookmarks";

interface PaginationMeta {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

interface PageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
    }>;
}

const Bookmark = async ({ searchParams }: PageProps) => {
    const resolvedSearchParams = await searchParams;
    const token = await getAuthToken();
    let bookmarks: Event[] = [];
    let paginationMeta: PaginationMeta | undefined;

    const queryParams = new URLSearchParams();
    if (resolvedSearchParams.page) queryParams.set("page", resolvedSearchParams.page);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/bookmark/favorite?${queryParams.toString()}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${token}`,
        },
        cache: 'no-store',
    });
    await validateResponse(response.status);
    if (!response.ok) {
        throw new Error(`Failed to fetch host events. Status: ${response.status}`);
    }
    const data = await response.json();
    bookmarks = data.data || [];
    paginationMeta = data.meta;

    return <BookmarkClient initialBookmarks={bookmarks} paginationMeta={paginationMeta} />;
};

export default Bookmark;