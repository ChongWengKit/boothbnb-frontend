import DashboardEventDetailClient from "@/components/dashboard/eventSection";
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
        if (!response.ok) {
        throw new Error('Failed to fetch event');
    }
    const data = await response.json();
    return data.data;
}

export default async function DashboardEventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const event = await getEvent(slug);

    return (<>
        <Link href="/dashboard" className="m-8 flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
            <IoArrowBack /> Back to dashboard
        </Link>
        <DashboardEventDetailClient event={event}/></>);
}
