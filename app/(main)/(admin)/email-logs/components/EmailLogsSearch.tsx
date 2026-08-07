'use client';
import { Search } from "lucide-react";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function EmailLogsSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = React.useState(searchParams.get("search") || "");
    const [status, setStatus] = React.useState(searchParams.get("status") || "");
    const [category, setCategory] = React.useState(searchParams.get("category") || "");

    const handleApplyFilters = (e?: React.FormEvent) => {
        e?.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (search) params.set("search", search); else params.delete("search");
        if (status) params.set("status", status); else params.delete("status");
        if (category) params.set("category", category); else params.delete("category");
        params.set("page", "1");
        router.push(`?${params.toString()}`);
    };
    return (
        <>
            <form
                onSubmit={handleApplyFilters}
                className="flex flex-wrap items-center gap-4 rounded-lg bg-background p-4">
                <div className="flex-1 min-w-[200px]">
                    <input
                        type="text"
                        placeholder="Search..."
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
                        <option value="PENDING">Pending</option>
                        <option value="SUCCESSFUL">Successful</option>
                        <option value="FAILED">Failed</option>
                        <option value="BOUNCED">Bounced</option>
                        <option value="COMPLAINED">Complained</option>

                    </select>
                </div>
                <div className="w-48">
                    <select
                        className="w-full rounded-lg border border-border bg-background px-4 py-1 text-foreground"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="VERIFICATION">Verification</option>
                        <option value="PASSWORD_RESET">Password Reset</option>
                        <option value="BOOKING_CONFIRMATION">Booking Confirmation</option>
                        <option value="HOST_APPROVED">Host Approval</option>
                        <option value="ADMIN_INVITATION">Admin Invitation</option>
                    </select>
                </div>
                <Button type="submit" className="cursor-pointer">Filter</Button>
            </form>


        </>
    )
};

