
import { getAuthToken } from "@/app/contexts/auth";

export async function updateProfileAction(data: { profile_photo: string }) {
    const token = await getAuthToken();

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/auth/photo`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            return { success: false, message: result.message || "Failed to update profile" };
        }

        return { success: true, data: result.data };
    } catch (error) {
        return { success: false, message: "An unexpected error occurred" };
    }
}
