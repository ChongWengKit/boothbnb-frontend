import React, { Suspense } from "react";
import { getAuthToken, validateResponse } from "@/app/contexts/auth";
import type { Event } from "@/app/(main)/(vendor)/actions/useBookmarks";
import EventResultsContainer from "./EventResultsContainer";
import PaginationContainer from "./PaginationContainer";
import { Spinner } from "@/components/ui/spinner";

interface PaginationMeta {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

interface SearchParams {
    query?: string;
    title?: string;
    category?: string;
    ne_lat?: string;
    ne_lng?: string;
    sw_lat?: string;
    sw_lng?: string;
    lat?: string;
    lon?: string;
    extent?: string;
    type?: string;
    start_date?: string;
    end_date?: string;
    page?: string;
    limit?: string;
}

const paginationMetaDefault: PaginationMeta = {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 20,
    hasNextPage: false,
    hasPreviousPage: false,
};

async function fetchBookmarks(token: string | undefined): Promise<number[]> {
    if (!token) return [];
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/bookmark/favorite-id`, {
            headers: token ? { Authorization: `bearer ${token}` } : {},
            cache: 'no-store'
        });

        if (response.ok) {
            const data = await response.json();
            return data.data || [];
        }

        await validateResponse(response.status);
    } catch (e) {
    }
    return [];
}

async function fetchEvents(searchParams: SearchParams, token: string | undefined): Promise<{ data: Event[]; meta: PaginationMeta }> {
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
            if (searchParams.type) queryParams.set("type", searchParams.type);
        }

        const now = Date.now();
        const start_date = searchParams.start_date || new Date(now).toISOString();
        const end_date = searchParams.end_date || new Date(now + 604800000).toISOString();

        queryParams.set("start_date", start_date);
        queryParams.set("end_date", end_date);

        if (searchParams.page) queryParams.set("page", searchParams.page);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/event?${queryParams.toString()}`, {
            headers: token ? { Authorization: `bearer ${token}` } : {},
            cache: 'no-store'
        });
        await new Promise(resolve => setTimeout(resolve, 2000)); 

        if (res.ok) {
            const data = await res.json();
            return data || { data: [], meta: paginationMetaDefault };
        }
    } catch (e) {
    }
    return { data: [], meta: paginationMetaDefault };
}
export default function EventResultsLoader({ searchParams }: { searchParams: SearchParams }) {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center py-20">
                <Spinner className="size-8" />
            </div>
        }>
            <EventDataFetcher searchParams={searchParams} />
        </Suspense>
    );
}
async function EventDataFetcher({ searchParams }: { searchParams: SearchParams }) {
    const token = await getAuthToken();

    const [eventsResult, bookmarksResult] = await Promise.all([
        fetchEvents(searchParams, token),
        fetchBookmarks(token)
    ]);
    const events = eventsResult.data;
    const paginationMeta = eventsResult.meta;
    const bookmarks = bookmarksResult.map((id: number) => ({ id } as Event));

    return (
        <>
            <EventResultsContainer initialEvents={events} initialBookmarks={bookmarks} totalItems={paginationMeta.totalItems} />
            <PaginationContainer
                currentPage={paginationMeta.currentPage}
                totalPages={paginationMeta.totalPages}
                hasNextPage={paginationMeta.hasNextPage}
                hasPreviousPage={paginationMeta.hasPreviousPage}
            />
        </>
    );
}