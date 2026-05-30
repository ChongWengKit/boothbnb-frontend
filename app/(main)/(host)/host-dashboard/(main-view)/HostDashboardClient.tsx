'use client';

import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { IoMdAdd } from "react-icons/io";
import EventResultsList from "@/app/(main)/(public)/components/EventResultsList";
import Pagination from "@/components/Pagination";
import { type EventStatus } from "@/app/(main)/(public)/components/EventCard";
import { Button } from "@/components/ui/button";

;


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
    longitude: number;
}


interface PaginationMeta {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

interface HostDashboardClientProps {
    events: HostEvent[];
    paginationMeta?: PaginationMeta;
}

const HostDashboardClient: React.FC<HostDashboardClientProps> = ({ events, paginationMeta }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
    };

    return (
        <>
            <EventResultsList
                events={events}
                isLoading={false}
                emptyTitle="No events found"
                emptySubtitle="Try creating some events."
                showStatus={true}
                baseUrl="host-dashboard"
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

export default HostDashboardClient;