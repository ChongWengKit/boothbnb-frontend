import { getAuthToken, validateResponse } from "@/app/contexts/auth";
import CurrencyClient from "./CurrencyClient";

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


interface PageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        search?: string;
        status?: string;
        actionType?: string;
    }>;
}

const CurrencyAdminPage = async ({ searchParams }: PageProps) => {
    const resolvedSearchParams = await searchParams;
    const token = await getAuthToken();
    let currencies: Currency[] = [];
    let paginationMeta: PaginationMeta | undefined;
    let response: Response | undefined;
    const queryParams = new URLSearchParams();
    if (resolvedSearchParams.page) queryParams.set("page", resolvedSearchParams.page);
    if (resolvedSearchParams.search) queryParams.set("search", resolvedSearchParams.search);
    if (resolvedSearchParams.limit) queryParams.set("limit", resolvedSearchParams.limit);
    if (resolvedSearchParams.status) queryParams.set("status", resolvedSearchParams.status);

    response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/admin/currency?${queryParams.toString()}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${token}`,
        },
        cache: 'no-store',
    });
    await validateResponse(response.status);
    if (!response.ok) {
        throw new Error(`Failed to fetch host events. Status: ${response.status}`);
    }
    const data = await response.json();
    currencies = data.data || [];
    paginationMeta = data.meta;



    return (
        <CurrencyClient currencies={currencies} paginationMeta={paginationMeta} />
    );
};

export default CurrencyAdminPage;
