'use server'

import { getAuthToken } from "@/app/contexts/auth";
import { revalidatePath } from "next/cache";
import { validateResponse } from "@/app/contexts/auth";
export async function updateApprovalAction(id: number, status: "APPROVED" | "REJECTED") {
    const token = await getAuthToken();
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/admin/approval`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `bearer ${token}`,
            },
            body: JSON.stringify({ id, status }),
        });

        const data = await response.json();
        await validateResponse(response.status);

        if (response.ok) {
            return { success: true, message: data.message };
        }
        return { success: false, message: data.message || "Failed to update request" };
    } catch (error) {
        console.error("Action error:", error);
        return { success: false, message: "An error occurred while updating the request" };
    }
}