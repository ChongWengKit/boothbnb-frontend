'use server'

import { getAuthToken } from "@/app/contexts/auth";
import { revalidatePath } from "next/cache";
import { validateResponse } from "@/app/contexts/auth";

export async function updateCurrencyStatusAction(currency: string, is_enabled: boolean) {
    const token = await getAuthToken();
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/admin/currency`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `bearer ${token}`,
            },
            body: JSON.stringify({ currency, is_enabled }),
        });

        await validateResponse(response.status);
        const data = await response.json();

        revalidatePath('/admin-dashboard/currency');
        return { success: response.ok, message: data.message };
    } catch (error) {
        return { success: false, message: "An error occurred while updating currency status" };
    }
}
