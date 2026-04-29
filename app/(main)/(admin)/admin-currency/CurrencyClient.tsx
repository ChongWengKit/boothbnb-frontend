'use client';

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import CurrencyAdmin from "./components/CurrencyAdmin";

interface Currency {
    currency: string;
    rate: number;
    is_enabled: boolean;
    updated_at: string;
}

interface PaginationMeta {
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

interface CurrencyClientProps {
    currencies: Currency[];
    paginationMeta?: PaginationMeta;
}

const CurrencyClient: React.FC<CurrencyClientProps> = ({ currencies, paginationMeta }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [status, setStatus] = React.useState(searchParams.get("status") || "");
    const [search, setSearch] = React.useState(searchParams.get("search") || "");

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
    };

    const handleApplyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (search) params.set("search", search); else params.delete("search");
        if (status) params.set("status", status); else params.delete("status");
        params.set("page", "1");
        router.push(`?${params.toString()}`);
    };

    return (
        <>
            <div className="mb-8 flex flex-wrap items-center gap-4 rounded-lg bg-background p-4">
                <div className="flex-1 min-w-[200px]">
                    <input
                        type="text"
                        placeholder="Search currency code..."
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
                        <option value="">All Status</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>
                <Button className="cursor-pointer" onClick={handleApplyFilters}>Filter</Button>
            </div>

            <CurrencyAdmin requests={currencies} />


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

export default CurrencyClient;