'use client';
import { Link, Search } from "lucide-react";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IoMdAdd } from "react-icons/io";

export default function HostDashboardSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = React.useState(searchParams.get("search") || "");
    const [status, setStatus] = React.useState(searchParams.get("status") || "");

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
        </>
    )
};

