import DashboardEventDetailClient from "@/components/dashboard/EventSection";
import { getAuthToken, validateResponse } from "@/app/contexts/auth";
import { getCurrency } from "@/app/contexts/currency";
import Link from "next/dist/client/link";
import { IoArrowBack } from "react-icons/io5";

async function getEvent(slug: string) {
    const token = await getAuthToken();
    const currency = await getCurrency();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `bearer ${token}`;
    if (currency) headers['currency'] = currency;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/event/${slug}`, {
        cache: 'no-store',
        headers,
    });
        await validateResponse(response.status);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { success: false, message: errorData.message || 'Something went wrong' };
    }

    const data = await response.json();
    return { success: true, event: data.data };
}

export default async function DashboardEventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const result = await getEvent(slug);

    if (!result.success) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-xl font-bold">Something went wrong</h2>
                <p className="text-muted-foreground">{result.message}</p>
            </div>
        );
    }

    return (<>
        <Link href="/dashboard" className="mx-4 my-8 md:mx-8 flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
            <IoArrowBack /> Back to dashboard
        </Link>
        <DashboardEventDetailClient event={result.event} isHostDashboard={false} /></>);
}
