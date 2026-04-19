'use server'

import { getAuthToken, validateResponse } from "@/app/contexts/auth";
import { revalidatePath } from "next/cache";

export async function getUserBookingsAction(page: number = 1, limit: number = 10) {
    const token = await getAuthToken();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/payment?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${token}`
        },
        cache: 'no-store'
    });
    await validateResponse(response.status);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { success: false, message: errorData.message || 'Failed to fetch bookings' };
    }

    return await response.json();
}

export async function getBookingByIdAction(id: string) {
    const token = await getAuthToken();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/payment/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${token}`
        },
        cache: 'no-store'
    });
    await validateResponse(response.status);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { success: false, message: errorData.message || 'Failed to fetch booking details' };
    }

    return await response.json();
}
