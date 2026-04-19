import { getAuthToken, validateResponse } from "@/app/contexts/auth";
import AccountDetailClient from "./AccountDetailClient";

async function getAccountDetail(slug: string, page: string = '1') {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/account/${slug}?page=${page}`, {
        cache: 'no-store'
    });
        if (!response.ok) {
        throw new Error('Failed to fetch event');
    }
    const data = await response.json();
    return { account: data.data, meta: data.meta };
}

export default async function AccountDetailPage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ page?: string }> }) {
    const { slug } = await params;
    const { page } = await searchParams;
    const { account, meta } = await getAccountDetail(slug, page);
    
    return <AccountDetailClient account={account} paginationMeta={meta} />;
}
