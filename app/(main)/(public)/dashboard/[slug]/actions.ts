'use server'

import { getAuthToken, validateResponse } from "@/app/contexts/auth";
import { revalidatePath } from "next/cache";

export async function publishEventAction(slug: string) {
    const token = await getAuthToken();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/event/${slug}/publish`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${token}`
        }
    });
    await validateResponse(response.status);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { success: false, message: errorData.message || 'Failed to publish event' };
    }

    revalidatePath(`/dashboard/${slug}`);
    return { success: true };
}

export async function checkoutAction(eventId: string, boothId: string, slug: string) {
    const token = await getAuthToken();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/event/${slug}/checkout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${token}`,
        },
        body: JSON.stringify({ eventId, boothId })
    });
    await validateResponse(response.status);

    if (!response.ok) {
        
        const errorData = await response.json().catch(() => ({}));
        return { success: false, message: errorData.message || 'Failed to initiate checkout' };
    }

    const data = await response.json();
    return { data };
}