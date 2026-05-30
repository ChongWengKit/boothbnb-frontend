import { getAuthToken } from "@/app/contexts/auth";
import CurrencyClient from "../CurrencyClient";
interface SearchParams {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    actionType?: string;
};

interface Currency {
    currency: string;
    rate: number;
    is_enabled: boolean;
    updated_at: string;
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

async function fetchCurrency(searchParams: SearchParams, token: string | undefined): Promise<{ data: Currency[]; meta: PaginationMeta }> {
    try {
        const queryParams = new URLSearchParams();

        if (searchParams.page) queryParams.set("page", searchParams.page);
        if (searchParams.search) queryParams.set("search", searchParams.search);
        if (searchParams.limit) queryParams.set("limit", searchParams.limit);
        if (searchParams.status) queryParams.set("status", searchParams.status);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/admin/currency?${queryParams.toString()}`, {
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
export default async function CurrencyResultsLoader({ searchParams }: { searchParams: SearchParams }) {
    const token = await getAuthToken();
    const data = await fetchCurrency(searchParams, token);
    return (
        <CurrencyClient currencies={data.data} paginationMeta={data.meta} />
    )
}