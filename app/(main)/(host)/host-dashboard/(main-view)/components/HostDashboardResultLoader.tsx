import { getAuthToken } from "@/app/contexts/auth";
import HostDashboardClient from "../HostDashboardClient";
interface SearchParams {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    actionType?: string;
};

export interface HostEvent {
    id: number;
    title: string;
    start_date: string;
    end_date: string;
    address: string;
    thumbnail: string | null;
    slug: string;
    total_bookings: number;
    total_capacity: number;
    available_booths: number;
    latitude: number;
    longitude: number
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

async function fetchHostEvents(searchParams: SearchParams, token: string | undefined): Promise<{ data: HostEvent[]; meta: PaginationMeta }> {
    try {
        const queryParams = new URLSearchParams();
        if (searchParams.page) queryParams.set("page", searchParams.page);
        if (searchParams.search) queryParams.set("search", searchParams.search);
        if (searchParams.status) queryParams.set("status", searchParams.status);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/host/event?${queryParams.toString()}`, {
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
export default async function HostDashboardResultsLoader({ searchParams }: { searchParams: SearchParams }) {
    const token = await getAuthToken();
    const data = await fetchHostEvents(searchParams, token);
    return (
        <HostDashboardClient events={data.data} paginationMeta={data.meta} />
    )
}