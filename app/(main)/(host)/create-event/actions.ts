'use server';

import { getAuthToken, validateResponse } from "@/app/contexts/auth";
import { getCurrency } from "@/app/contexts/currency";
import { cookies } from "next/headers";

export interface Booth {
    id: string;
    name: string;
    type: "AVAILABLE" | "RESERVED" | "SOLD" | "LOCKED";
    price: number; // Price is initialized to 0 and updated as number
    width: number;
    height: number;
    x: number;
    y: number;
    rotation: number;
    description?: string;
}

export interface CreateEventRequest {
    title: string;
    description: string;
    address: string;
    latitude: number;
    longitude: number;
    start_date: string;
    end_date: string;
    category: string;
    booths: Booth[];
    images: string[];
}

export async function createEventAction(eventData: CreateEventRequest) {
    const token = await getAuthToken();
    const currency = await getCurrency();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/event`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${token}`,
            ...(currency && { 'currency': currency })
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