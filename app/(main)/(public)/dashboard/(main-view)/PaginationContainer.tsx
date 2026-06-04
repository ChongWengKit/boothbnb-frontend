'use client';

import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
export default function PaginationContainer({ currentPage, totalPages, hasNextPage, hasPreviousPage }: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isMapView = searchParams.get("view") === "map";

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(window.location.search);
        params.set("page", newPage.toString());
        router.push(`/dashboard?${params.toString()}`, { scroll: !isMapView });
    };

    if (totalPages <= 1) {
        return null; 
    }

    return (
        <div className="fixed bottom-[72px] left-0 right-0 py-2 z-[1002] md:relative md:bottom-0 md:bg-transparent md:border-none md:z-auto">
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                hasNextPage={hasNextPage}
                hasPreviousPage={hasPreviousPage}
            />
        </div>
    );
}