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

    const [search, setSearch] = React.useState(searchParams.get("search") || "");
    const [status, setStatus] = React.useState(searchParams.get("status") || "");

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
    };

    const handleApplyFilters = (e?: React.FormEvent) => {
        e?.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (search) params.set("search", search); else params.delete("search");
        if (status) params.set("status", status); else params.delete("status");
        params.set("page", "1");
        router.push(`?${params.toString()}`);
    };

    return (
        <>
            <div className="flex flex-wrap justify-between items-center p-4 my-8">
                <h2 className="text-3xl font-bold">Your Events</h2>
                <Link href="/create-event">
                    <button className="flex cursor-pointer items-center gap-4 rounded-lg bg-primary px-4 py-2 font-bold text-primary-foreground transition-colors hover:bg-primary/90">
                        <IoMdAdd className="w-6 h-6" />
                        <span>Create Event</span>
                    </button>
                </Link>
            </div>

            <form 
                onSubmit={handleApplyFilters}
                className="mb-8 bg-background flex flex-wrap items-center gap-4 rounded-lg p-4"
            >
                <div className="flex-1 min-w-[200px]">
                    <input
                        type="text"
                        placeholder="Search event name..."
                        className="w-full rounded-lg border border-border bg-background px-4 py-1 text-foreground"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="w-48">
                    <select
                        className="w-full rounded-lg border border-border bg-background px-4 py-1 text-foreground"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="CLOSED">Closed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
                <Button type="submit" className="cursor-pointer">Filter</Button>
            </form>

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