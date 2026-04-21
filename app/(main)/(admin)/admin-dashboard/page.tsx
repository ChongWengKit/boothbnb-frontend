import {getAuthToken, validateResponse } from "@/app/contexts/auth";
import AdminDashboardClient from "@/app/(main)/(admin)/admin-dashboard/AdminDashboardClient";

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

enum ActionType{
    HOST_APPROVAL="HOST_APPROVAL"
}
interface PaginationMeta {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}


interface PageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        search?: string;
        status?: string;
        actionType?: string;
    }>;
}

const AdminDashboard = async ({ searchParams }: PageProps) => {
    const resolvedSearchParams = await searchParams;
    const token = await getAuthToken();
    let adminRequests: AdminRequest[] = [];
    let paginationMeta: PaginationMeta | undefined;
    let response: Response | undefined;
    try {
        const queryParams = new URLSearchParams();
        if (resolvedSearchParams.page) queryParams.set("page", resolvedSearchParams.page);
        if (resolvedSearchParams.search) queryParams.set("search", resolvedSearchParams.search);
        if (resolvedSearchParams.actionType) queryParams.set("actionType", resolvedSearchParams.actionType);

        response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/admin?${queryParams.toString()}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `bearer ${token}`,
            },
            cache: 'no-store',
        });

        if (response.ok) {
            const data = await response.json();
            adminRequests = data.data || [];
            paginationMeta = data.meta;
        }
    } catch (error) {
        console.error(error);
    }
    if (response) {
        await validateResponse(response.status);
    }
    return (
        <AdminDashboardClient adminRequests={adminRequests} paginationMeta={paginationMeta} />
    );
};

export default AdminDashboard;
