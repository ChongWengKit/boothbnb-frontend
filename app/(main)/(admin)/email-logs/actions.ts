'use server'

import { getAuthToken } from "@/app/contexts/auth";
import { revalidatePath } from "next/cache";
import { validateResponse } from "@/app/contexts/auth";

export async function getEmailLogsAction(page: number = 1, limit: number = 10) {
    const token = await getAuthToken();
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/admin/email?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `bearer ${token}`,
            },
            cache: 'no-store'
        });

        await validateResponse(response.status);
        return await response.json();
    } catch (error) {
        return { success: false, message: "An error occurred while fetching email logs" };
    }
}

export async function resendEmailAction(logId: number) {
    const token = await getAuthToken();
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/admin/email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `bearer ${token}`,
            },
            body: JSON.stringify({ logId }),
        });

        const data = await response.json();
        await validateResponse(response.status);

        if (response.ok) {
            return { success: true, message: data.message };
        }
        return { success: false, message: data.message || "Failed to resend email" };
    } catch (error) {
        return { success: false, message: "An error occurred while resending the email" };
    }
}