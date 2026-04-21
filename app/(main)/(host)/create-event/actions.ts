'use server';

import { validateResponse } from "@/app/contexts/auth";
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