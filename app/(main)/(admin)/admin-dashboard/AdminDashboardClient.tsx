'use client';

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import AdminApproval from "./components/AdminApproval";

interface AdminRequest {
    user: {
        id: number;
        username: string;
        email: string;
    };
    action_type: ActionType;
    status: "PENDING" | "APPROVED" | "REJECTED";
    created_at: string;
    updated_at: Date | null;
    id: number;
    user_id: number;
}


enum ActionType {
    HOST_APPROVAL = "HOST_APPROVAL"
}

interface PaginationMeta {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

interface AdminDashboardClientProps {
    adminRequests: AdminRequest[];
    paginationMeta?: PaginationMeta;
}
const AdminDashboardClient: React.FC<AdminDashboardClientProps> = ({ adminRequests, paginationMeta }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
    };

    return (
        <>
            <AdminApproval requests={adminRequests} />
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

export default AdminDashboardClient;