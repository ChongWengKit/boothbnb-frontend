import React from "react";
import { cookies } from "next/headers";
import { deleteAuthToken, getAuthToken, validateResponse } from "@/app/contexts/auth";
import HostDashboardClient from "./HostDashboardClient";
import { type EventStatus } from "@/app/(main)/(public)/components/EventCard";

export interface HostEvent {
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
  longitude: number
}

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
        search?: string;
        status?: string;
    }>;
}

const HostDashboard = async ({ searchParams }: PageProps) => {
    const resolvedSearchParams = await searchParams;
    const token = await getAuthToken();
    let hostEvents: HostEvent[] = [];
    let paginationMeta: PaginationMeta | undefined;
    let response: Response | undefined;
    try {
        const queryParams = new URLSearchParams();
        if (resolvedSearchParams.page) queryParams.set("page", resolvedSearchParams.page);
        if (resolvedSearchParams.search) queryParams.set("search", resolvedSearchParams.search);
        if (resolvedSearchParams.status) queryParams.set("status", resolvedSearchParams.status);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/host/event?${queryParams.toString()}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `bearer ${token}`,
            },
            cache: 'no-store',
        });

        if (response.ok) {
            const data = await response.json();
            hostEvents = data.data || [];
            paginationMeta = data.meta;
        }
    } catch (error) {
    }
    if (response) {
        await validateResponse(response.status);
    }
    return (
        <HostDashboardClient events={hostEvents} paginationMeta={paginationMeta} />
    );
};

export default HostDashboard;
