import React from 'react';
import { getAuthToken, validateResponse } from "@/app/contexts/auth";
import { getCurrency } from "@/app/contexts/currency";
import EditEventClient from './EditEventClient';

async function getEvent(slug: string) {
    const token = await getAuthToken();
    const currency = await getCurrency();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/event/${slug}/edit`, {
        cache: 'no-store',
        headers: {
            'Authorization': `bearer ${token}`,
            'currency': currency || '',
        },
    });

    await validateResponse(response.status);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { success: false, message: errorData.message || 'Something went wrong' };
    }

    const data = await response.json();
    return { success: true, event: data.data };
}

export default async function EditEventPage({ params }: { params: Promise<{ slug: string }> }) {
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

    return <EditEventClient event={result.event} />;
}