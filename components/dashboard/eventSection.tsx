import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { MdCalendarToday, MdModeEdit } from "react-icons/md";
import { IoArrowBack, IoWalletOutline } from "react-icons/io5";
import { BookmarkIcon } from 'lucide-react';
import Link from "next/link";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";

import { EventCarousel } from "@/components/event-detail/Carousel";
import BoothSection from "@/components/dashboard/boothSection";
import EventMap from "@/components/event-detail/EventMap";
import BookmarkToggle from "@/components/dashboard/BookmarkToggle";
import { User } from "@/app/contexts/UserContext";
import { formatEventDate } from "@/app/lib/util";
import { Booth } from "@/app/(main)/(host)/create-event/actions";

interface BookingSummary {
    booth_name: string;
    booked_at: string;
    price: number | string;
    status: string;
    vendor: {
        username: string;
        profile_photo?: string | null;
    };
}

interface Booking {
  payment_status: string;
  vendor?: {
    username: string;
    email: string;
  };
  booked_at?: string;
}

interface EventDetail {
    id: number;
    title: string;
    slug: string;
    description: string;
    address: string;
    latitude: number;
    longitude: number;
    start_date: string;
    end_date: string;
    category: string;
    available_booths: number;
    total_capacity: number;
    images: { url: string }[];
    booths: (Booth & { bookings?: Booking[] })[];
    host_id: number;
    username: string;
    profile_photo?: string | null;
    is_bookmarked: boolean;
    bookmarks_count: number;
    status: string;
    total_money_made?: number;
    booking_summaries?: BookingSummary[];
}

export default async function DashboardEventDetailClient({ event, isHost = false }: { event: EventDetail; isHost?: boolean }) {
    const cookieStore = await cookies();
    const token = cookieStore.get('authentication_token')?.value;

    let user: User | null = null;
    let isOwner = false;
    if (token) {
        try {
            user = jwtDecode<User>(token);
            isHost = user.role === "HOST";
            isOwner = Number(user.id) === Number(event.host_id);
        } catch (e) {
        }
    }


    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-center">
                    <EventCarousel images={event.images} />
                </div>

                <div className="flex flex-col gap-8 w-full p-4 m-2">
                    <div className="flex w-full items-start gap-12">
                        <div className="flex-1 rounded-xl border border-border bg-card px-8 py-6 shadow-sm">

                            <div className="flex items-center justify-between w-full mb-6">
                                <h1 className="text-4xl font-bold flex items-center gap-4">
                                    {event.title}
                                    {isOwner && event.status === 'DRAFT' && (
                                        <Link href={`/host-dashboard/${event.slug}/edit`}>
                                            <MdModeEdit className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground" />
                                        </Link>
                                    )}
                                </h1>
                                <BookmarkToggle 
                                    eventId={event.id} 
                                    initialIsBookmarked={event.is_bookmarked} 
                                    initialCount={event.bookmarks_count}
                                    isHost={isHost}
                                />
                            </div>

                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-muted-foreground">By</span>
                                <Link href={`/account/${event.username}`} className="flex items-center gap-2 group">
                                    <span className="font-semibold group-hover:underline">{event.username}</span>
                                    {event.profile_photo ? (
                                        <Image
                                            src={event.profile_photo}
                                            className="w-10 h-10 rounded-full object-cover border"
                                            alt={event.username}
                                            width={40}
                                            height={40}
                                        />
                                    ) : (
                                        <div className="h-10 w-10 rounded-full bg-muted"></div>
                                    )}
                                </Link>
                            </div>

                            <div className="mb-10 space-y-3 text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <FaLocationDot className="text-muted-foreground" />
                                    {event.address}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MdCalendarToday className="text-muted-foreground" />
                                    <span>{formatEventDate(event.start_date)} - {formatEventDate(event.end_date)}</span>
                                </div>
                            </div>

                            <section className="mb-10 border-t pt-8">
                                <h2 className="text-2xl font-bold mb-4">Overview</h2>
                                <p className="leading-relaxed text-muted-foreground">
                                    {event.description}
                                </p>
                            </section>

                            {isOwner && (
                                <>
                                    <section className="mb-10 border-t pt-8">
                                        <h2 className="text-2xl font-bold mb-4">Financial Summary</h2>
                                        <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center gap-4">
                                            <div className="p-3 bg-green-500 rounded-full text-foreground text-2xl shadow-sm">
                                                <IoWalletOutline />
                                            </div>
                                            <div>
                                                <p className="text-green-700 text-xs font-bold uppercase tracking-wider">Total Revenue (Paid)</p>
                                                <p className="text-3xl font-bold text-green-900">
                                                    ${event.total_money_made?.toLocaleString() ?? "0"}
                                                </p>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="mb-10 border-t pt-8">
                                        <h2 className="text-2xl font-bold mb-4">Bookings Summary</h2>
                                        <div className="flex flex-col gap-3">
                                            {event.booking_summaries && event.booking_summaries.length > 0 ? (
                                                event.booking_summaries.map((booking: BookingSummary, idx: number) => (
                                                    <div key={idx} className="flex items-center justify-between rounded-lg border border-border bg-background p-4 transition-colors hover:bg-accent/30">
                                                        <Link href={`/account/${booking.vendor.username}`} className="flex items-center gap-3">
                                                            <Image
                                                                src={booking.vendor.profile_photo || ""}
                                                                className="w-10 h-10 rounded-full bg-secondary object-cover border"
                                                                alt={booking.vendor.username}
                                                                width={40}
                                                                height={40}
                                                            />
                                                            <div>
                                                                <p className="font-semibold text-foreground">{booking.vendor.username}</p>
                                                                <p className="text-xs text-muted-foreground">Booth: {booking.booth_name}</p>
                                                            </div>
                                                        </Link>

                                                        <div className="flex gap-4 items-center">
                                                            <div className="text-right">
                                                                <p className="font-bold text-foreground">${Number(booking.price).toLocaleString()}</p>
                                                                <p className="text-[10px] text-muted-foreground">
                                                                    {new Date(booking.booked_at).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                            <div className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${booking.status === 'PAID'
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-yellow-100 text-yellow-700'
                                                                }`}>
                                                                {booking.status}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="italic text-muted-foreground">No bookings recorded yet.</p>
                                            )}
                                        </div>
                                    </section>
                                </>
                            )}

                            <section className=" w-full border-t pt-8 ">
                                <h3 className="text-2xl font-bold mb-4">Location</h3>
                                <div className="rounded-xl overflow-hidden border h-[250px] md:h-[500px]">
                                    <EventMap zoom={18} interactive={true} latitude={event.latitude} longitude={event.longitude} />
                                </div>
                            </section>
                        </div>

                        <div className="hidden md:block">
                            <BoothSection event={event} isHost={isHost} />
                        </div>
                    </div>

                </div>
                <div className="sticky z-9999 bottom-0 left-0 right-0 md:hidden">

                    <BoothSection event={event} isHost={isHost} />
                </div>
            </div>
        </>
    );
}