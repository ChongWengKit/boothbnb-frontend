'use client';

import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";

export default function PaginationContainer({ currentPage, totalPages, hasNextPage, hasPreviousPage }: any) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isMapView = searchParams.get("view") === "map";

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(window.location.search);
        params.set("page", newPage.toString());
        router.push(`/dashboard?${params.toString()}`);
    };

    return (
        <div className={`${isMapView ? "fixed bottom-[60px] left-0 right-0 backdrop-blur-md py-2 border-t z-[1002] md:relative md:bottom-0 md:bg-transparent md:border-none md:z-auto" : "m-4"}`}>
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