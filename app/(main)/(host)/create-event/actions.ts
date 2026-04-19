'use server';

import { validateResponse } from "@/app/contexts/auth";
import { cookies } from "next/headers";

export async function createEventAction(eventData: any) {
    const cookieStore = await cookies();
    const token = cookieStore.get('authentication_token')?.value;
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/event`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${token}`
        },
        body: JSON.stringify(eventData)
    });
    await validateResponse(response.status);

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        return { success: false, message: data.message || 'Failed to create event', status: response.status };
    }

    return { ...data, status: response.status };
}