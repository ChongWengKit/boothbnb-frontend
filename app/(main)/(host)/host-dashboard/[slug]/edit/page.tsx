import React from 'react';
import { getAuthToken, validateResponse } from "@/app/contexts/auth";
import EditEventClient from './EditEventClient';

async function getEvent(slug: string) {
    const token = await getAuthToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/event/${slug}/detail`, {
        cache: 'no-store',
        headers: {
            'Authorization': `bearer ${token}`,
        },
    });

    await validateResponse(response.status);
    if (!response.ok) {
        console.log(response)
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