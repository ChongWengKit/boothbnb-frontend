"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function StripeCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        toast.success("Onboarding complete! Verifying account status...");
        router.push("/stripe-connect");
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );
}