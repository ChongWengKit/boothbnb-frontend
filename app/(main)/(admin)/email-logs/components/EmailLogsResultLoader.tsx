import { getAuthToken } from "@/app/contexts/auth";
import EmailLogsClient from "../EmailLogsClient";
interface SearchParams {
    page?: string;
    limit?: string;
    search?: string;
    category?: "VERIFICATION" | "PASSWORD_RESET" | "BOOKING_CONFIRMATION" | "HOST_APPROVED" | "ADMIN_INVITATION";
    status?: "PENDING" | "SUCCESSFUL" | "FAILED" | "BOUNCED" | "COMPLAINED";
}
interface EmailLog {
    id: number;
    user_id: number;
    category: "VERIFICATION" | "PASSWORD_RESET" | "BOOKING_CONFIRMATION" | "HOST_APPROVED" | "ADMIN_INVITATION";
    payload: {
        email: string;
        name: string;
    };
    status: "PENDING" | "SUCCESSFUL" | "FAILED" | "BOUNCED" | "COMPLAINED";
    email_id: string | null;
    attempts: number;
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

async function fetchEmailLogs(searchParams: SearchParams, token: string | undefined): Promise<{ data: EmailLog[]; meta: PaginationMeta }> {
    try {
        const queryParams = new URLSearchParams();
        if (searchParams.page) queryParams.set("page", searchParams.page);
        if (searchParams.search) queryParams.set("search", searchParams.search);
        if (searchParams.status) queryParams.set("status", searchParams.status);
        if (searchParams.category) queryParams.set("category", searchParams.category);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/admin/email?${queryParams.toString()}`, {
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
export default async function EmailLogsResultsLoader({ searchParams }: { searchParams: SearchParams }) {
    const token = await getAuthToken();
    const data = await fetchEmailLogs(searchParams, token);
    return (
        <EmailLogsClient emailLogs={data.data} paginationMeta={data.meta} />
    )
}