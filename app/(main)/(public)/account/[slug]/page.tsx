import { getAuthToken, validateResponse } from "@/app/contexts/auth";
import AccountDetailClient from "./AccountDetailClient";


async function getAccountDetail(slug: string, page: string = '1') {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/account/${slug}?page=${page}`, {
        cache: 'no-store'
    });
        if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { success: false, message: errorData.message || 'Something went wrong' };
    }

    const data = await response.json();
    return {
        success: true,
        account: data.data,
        meta: data.meta
    };
}

export default async function AccountDetailPage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ page?: string }> }) {
    const { slug } = await params;
    const { page } = await searchParams;
    const result = await getAccountDetail(slug, page);

    if (!result.success) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-xl font-bold">Something went wrong</h2>
                <p className="text-muted-foreground">{result.message}</p>
            </div>
        );
    }

    return <AccountDetailClient account={result.account} paginationMeta={result.meta} />;
}
