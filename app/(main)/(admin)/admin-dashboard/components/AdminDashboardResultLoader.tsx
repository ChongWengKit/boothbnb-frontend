import { getAuthToken } from "@/app/contexts/auth";
import AdminDashboardClient from "../AdminDashboardClient";
interface SearchParams {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    actionType?: string;
};

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
const paginationMetaDefault: PaginationMeta = {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 20,
    hasNextPage: false,
    hasPreviousPage: false,
};

async function fetchAdminDashboard(searchParams: SearchParams, token: string | undefined): Promise<{ data: AdminRequest[]; meta: PaginationMeta }> {
    try {
        const queryParams = new URLSearchParams();
        if (searchParams.page) queryParams.set("page", searchParams.page);
        if (searchParams.search) queryParams.set("search", searchParams.search);
        if (searchParams.actionType) queryParams.set("actionType", searchParams.actionType);
        if (searchParams.status) queryParams.set("status", searchParams.status);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/admin?${queryParams.toString()}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `bearer ${token}`,
            },
            cache: 'no-store',
        });

        if (response.ok) {
            const data = await response.json();
            return data || { data: [], meta: paginationMetaDefault };
        }
    } catch (e) { }
    return { data: [], meta: paginationMetaDefault };
}
export default async function AdminDashboardResultsLoader({ searchParams }: { searchParams: SearchParams }) {
    const token = await getAuthToken();
    const data = await fetchAdminDashboard(searchParams, token);
    return (
        <AdminDashboardClient adminRequests={data.data} paginationMeta={data.meta} />
    )
}