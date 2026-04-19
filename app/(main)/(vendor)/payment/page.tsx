import React from "react";
import { getUserBookingsAction } from "./action";
import PaymentClient from "./PaymentClient";

interface Booking {
    id: string;
    payment_status: "PAID" | "FAILED" | "PENDING";
    event_name: string;
    booth_name: string;
    booked_at: string;
}

interface PaginationMeta {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export default async function BookingsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const params = await searchParams;
    const page = parseInt(params.page || "1");
    const limit = 10;

    const response: {
        success: boolean;
        data?: Booking[];
        message?: string;
        meta?: PaginationMeta;
    } = await getUserBookingsAction(page, limit);

    if (!response.success) {
        return (
            <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
                <h1 className="text-2xl font-bold text-red-600 mb-2">Could not load bookings</h1>
                <p className="text-muted-foreground">{response.message || "An unexpected error occurred."}</p>
            </div>
        );
    }

    const bookings = response.data || [];
    const paginationMeta = response.meta;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">Payment Records</h1>
            <PaymentClient bookings={bookings} paginationMeta={paginationMeta} />
        </div>
    );
}