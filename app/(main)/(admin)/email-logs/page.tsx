import { getAuthToken, validateResponse } from "@/app/contexts/auth";
import EmailLogsClient from "./EmailLogsClient";
interface EmailLog {
    id: number;
    user_id: number;
    category: "VERIFICATION" | "PASSWORD_RESET" | "BOOKING_CONFIRMATION" | "HOST_APPROVED" | "ADMIN_INVITATION";
    payload: any;
    status: "PENDING" | "SUCCESSFUL" | "FAILED" | "BOUNCED" | "COMPLAINED";
    email_id: string | null;
    attempts: number;
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


interface PageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        search?: string;
        category?: "VERIFICATION" | "PASSWORD_RESET" | "BOOKING_CONFIRMATION" | "HOST_APPROVED" | "ADMIN_INVITATION";
        status?: "PENDING" | "SUCCESSFUL" | "FAILED" | "BOUNCED" | "COMPLAINED";
    }>;
}

const AdminDashboard = async ({ searchParams }: PageProps) => {
    const resolvedSearchParams = await searchParams;
    const token = await getAuthToken();
    let emailLogs: EmailLog[] = [];
    let paginationMeta: PaginationMeta | undefined;
    let response: Response | undefined;
    try {
        const queryParams = new URLSearchParams();
        if (resolvedSearchParams.page) queryParams.set("page", resolvedSearchParams.page);
        if (resolvedSearchParams.search) queryParams.set("search", resolvedSearchParams.search);
        if (resolvedSearchParams.status) queryParams.set("status", resolvedSearchParams.status);
        if (resolvedSearchParams.category) queryParams.set("category", resolvedSearchParams.category);

        response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/admin/email?${queryParams.toString()}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `bearer ${token}`,
            },
            cache: 'no-store',
        });

        if (response.ok) {
            const data = await response.json();
            emailLogs = data.data || [];
            paginationMeta = data.meta;
        }
    } catch (error) {
        console.error(error);
    }
    if (response) {
        await validateResponse(response.status);
    }
    return (
        <EmailLogsClient emailLogs={emailLogs} paginationMeta={paginationMeta} />
    );
};

export default AdminDashboard;
