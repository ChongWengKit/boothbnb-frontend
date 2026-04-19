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
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { success: false, message: errorData.message || 'Failed to publish event', status: response.status };
    }

    revalidatePath(`/host-dashboard/${slug}`);
    return { success: true, status: response.status };
}

export async function closeEventAction(slug: string) {
    const token = await getAuthToken();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/event/${slug}/close`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${token}`
        }
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { success: false, message: errorData.message || 'Failed to close event', status: response.status };
    }

    revalidatePath(`/host-dashboard/${slug}`);
    return { success: true, status: response.status };
}
