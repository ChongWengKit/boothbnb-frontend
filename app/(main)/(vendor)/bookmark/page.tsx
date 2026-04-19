import React from "react";
import { cookies } from "next/headers";
import { validateResponse } from "@/app/contexts/auth";
import BookmarkClient from "./BookmarkClient";
import type { Event } from "@/app/(main)/(vendor)/hooks/useBookmarks";

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
    const cookieStore = await cookies();
    const token = cookieStore.get('authentication_token')?.value;
    let bookmarks: Event[] = [];
    let paginationMeta: PaginationMeta | undefined;

    try {
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
                if (response.ok) {
            const data = await response.json();
            bookmarks = data.data || [];
            console.log("sadasdasd:" + response)
            paginationMeta = data.meta;
        }
    } catch (error) {
        console.error(error);
    }

    return <BookmarkClient initialBookmarks={bookmarks} paginationMeta={paginationMeta} />;
};

export default Bookmark;