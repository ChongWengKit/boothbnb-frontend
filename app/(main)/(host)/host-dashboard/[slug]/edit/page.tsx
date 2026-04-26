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
        
        throw new Error('Failed to fetch event');

    }
    const data = await response.json();
    return data.data;
}

export default async function EditEventPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const event = await getEvent(slug);
    
    return <EditEventClient event={event} />;
}