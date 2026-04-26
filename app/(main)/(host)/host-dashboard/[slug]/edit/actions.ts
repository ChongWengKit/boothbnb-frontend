'use server'

import { getAuthToken, validateResponse } from "@/app/contexts/auth";
import { CreateEventRequest } from "@/app/(main)/(host)/create-event/actions";
import { getCurrency } from "@/app/contexts/currency";
import { revalidatePath } from "next/cache";

export async function updateEventAction(slug: string, data: CreateEventRequest) {
    const token = await getAuthToken();
    const currency = await getCurrency();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/event/${slug}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${token}`,
            ...(currency && { 'currency': currency })
        },
        body: JSON.stringify(data)
    });
    await validateResponse(response.status);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { success: false, message: errorData.message || 'Failed to update event', status: response.status };
    }

    revalidatePath(`/host-dashboard/${slug}`);

    return { success: true, status: response.status };
}