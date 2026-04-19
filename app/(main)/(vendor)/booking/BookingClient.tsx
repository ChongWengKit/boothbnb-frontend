'use client';

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatEventDate } from "@/app/lib/util";
import Pagination from "@/components/Pagination";

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

interface BookingClientProps {
    bookings: Booking[];
    paginationMeta?: PaginationMeta;
}

const BookingClient: React.FC<BookingClientProps> = ({ bookings, paginationMeta }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
    };

    return (
        <>
            {bookings.length === 0 ? (
                <div className="mt-8 rounded-lg border-2 border-dashed border-border bg-card py-20 text-center">
                    <p className="text-xl font-semibold text-foreground">No Bookings found</p>
                    <p className="text-muted-foreground">Try book some event first</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4 mt-8 bg-secondary rounded-lg p-4">
                    {bookings.map((booking: Booking) => {
                        const isPaid = booking.payment_status === "PAID";

                        const BookingCard = (
                            <div className={`grid grid-cols-1 items-center gap-4 rounded-xl border border-transparent bg-background p-6 transition-colors md:grid-cols-12 ${isPaid ? "cursor-pointer hover:border-border hover:bg-accent/30" : "cursor-not-allowed opacity-70"}`}>
                                <div className="md:col-span-5 min-w-0">
                                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Event & Booth</p>
                                    <div className="flex flex-col">
                                        <h2 className="truncate text-lg font-bold text-foreground">{booking.event_name}</h2>
                                        <p className="text-sm font-medium text-muted-foreground">{booking.booth_name}</p>
                                    </div>
                                </div>

                                <div className="border-t border-border pt-4 md:col-span-4 md:border-t-0 md:border-l md:pt-0 md:pl-6">
                                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Booked On</p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatEventDate(booking.booked_at)}
                                    </p>
                                </div>

                                <div className="md:col-span-3 flex md:justify-end">
                                    {booking.payment_status === "PAID" ? (
                                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold tracking-wide uppercase">PAID</span>
                                    ) : booking.payment_status === "FAILED" ? (
                                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold tracking-wide uppercase">FAILED</span>
                                    ) : booking.payment_status === "PENDING" ? (
                                        <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold tracking-wide uppercase">PENDING</span>
                                    ) : null}
                                </div>
                            </div>
                        );

                        return isPaid ? (
                            <Link href={`/booking/${booking.id}`} key={booking.id}>
                                {BookingCard}
                            </Link>
                        ) : (
                            <div key={booking.id}>{BookingCard}</div>
                        );
                    })}
                </div>
            )}

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

export default BookingClient;