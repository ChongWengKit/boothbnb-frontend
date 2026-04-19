import React from "react";
import { getAuthToken, validateResponse } from "@/app/contexts/auth";
import type { Event } from "@/app/(main)/(vendor)/hooks/useBookmarks";
import EventResultsContainer from "./EventResultsContainer";
import PaginationContainer from "./PaginationContainer";

interface PaginationMeta {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export default async function EventResultsLoader({ searchParams }: { searchParams: any }) {
    const token = await getAuthToken();

    const paginationMetaDefault: PaginationMeta = {
        totalItems: 0,
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: 20,
        hasNextPage: false,
        hasPreviousPage: false,
    };

    const fetchBookmarks = async () => {
        if (!token) return [];
        let response: Response | undefined;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/bookmark/favorite-id`, {
                headers: token ? { Authorization: `bearer ${token}` } : {},
                cache: 'no-store'
            });

            if (res.ok) {
                const data = await res.json();
                return data.data || [];
            }
        } catch (e) {
            console.error("Error fetching bookmarks:", e);
        }
        if (response) {
            await validateResponse(response.status);
        }
        return [];
    };

    const fetchEvents = async () => {
        try {
            const queryParams = new URLSearchParams();
            if (searchParams.query) queryParams.set("search", searchParams.query);
            if (searchParams.title) queryParams.set("title", searchParams.title);
            if (searchParams.category) queryParams.set("category", searchParams.category);

            if (searchParams.ne_lat && searchParams.ne_lng && searchParams.sw_lat && searchParams.sw_lng) {
                queryParams.set("ne_lat", searchParams.ne_lat);
                queryParams.set("ne_lng", searchParams.ne_lng);
                queryParams.set("sw_lat", searchParams.sw_lat);
                queryParams.set("sw_lng", searchParams.sw_lng);
            } else {
                if (searchParams.lat) queryParams.set("latitude", searchParams.lat);
                if (searchParams.lon) queryParams.set("longitude", searchParams.lon);
            }

            const start_date = searchParams.start_date || new Date().toISOString();
            const end_date = searchParams.end_date || new Date(Date.now() + 604800000).toISOString();

            queryParams.set("start_date", start_date);
            queryParams.set("end_date", end_date);

            if (searchParams.page) queryParams.set("page", searchParams.page);
            if (searchParams.limit) queryParams.set("limit", searchParams.limit);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/event?${queryParams.toString()}`, {
                headers: token ? { Authorization: `bearer ${token}` } : {},
                cache: 'no-store'
            });
            if (res.ok) {
                const data = await res.json();
                return data || { data: [], meta: paginationMetaDefault };
            }
        } catch (e) {
            console.error("Error fetching events:", e);
        }
        return { data: [], meta: paginationMetaDefault };
    };

    const [eventsResult, bookmarksResult] = await Promise.all([fetchEvents(), fetchBookmarks()]);
    const events = eventsResult.data;
    const paginationMeta = eventsResult.meta;
    const bookmarks = bookmarksResult.map((id: number) => ({ id } as Event));

    return (
        <>
            <EventResultsContainer initialEvents={events} initialBookmarks={bookmarks} />
            <PaginationContainer
                currentPage={paginationMeta.currentPage}
                totalPages={paginationMeta.totalPages}
                hasNextPage={paginationMeta.hasNextPage}
                hasPreviousPage={paginationMeta.hasPreviousPage}
            />
        </>
    );
}