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
    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
    };

    return (
        <>
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