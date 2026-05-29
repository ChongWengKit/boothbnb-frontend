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
        email:string;
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

    const [actionType, setActionType] = React.useState(searchParams.get("actionType") || "");
    const [search, setSearch] = React.useState(searchParams.get("search") || "");

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
    };

    const handleApplyFilters = (e?: React.FormEvent) => {
        e?.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (search) params.set("search", search); else params.delete("search");
        if (actionType) params.set("actionType", actionType); else params.delete("actionType");
        params.set("page", "1");
        router.push(`?${params.toString()}`);
    };

    return (
        <>
            <form 
                onSubmit={handleApplyFilters}
                className="mb-8 flex flex-wrap items-center gap-4 rounded-lg bg-background p-4"
            >
                <div className="flex-1 min-w-[200px]">
                    <input
                        type="text"
                        placeholder="Search user..."
                        className="w-full rounded-lg border border-border bg-background px-4 py-1 text-foreground"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="w-48">
                    <select
                        className="w-full rounded-lg border border-border bg-background px-4 py-1 text-foreground"
                        value={actionType}
                        onChange={(e) => setActionType(e.target.value)}
                    >
                        <option value="">All Actions</option>
                        <option value="HOST_APPROVAL">Host Approval</option>
                    </select>
                </div>
                <Button type="submit" className="cursor-pointer">Filter</Button>
            </form>

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