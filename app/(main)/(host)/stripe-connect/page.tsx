"use client";
import React, { useState, useEffect } from "react";
import { useUserContext } from "@/app/contexts/UserContext";
import toast from "react-hot-toast";
import { getAuthToken, validateResponse } from "@/app/contexts/auth";
import { useSearchParams, useRouter } from "next/navigation";

export default function ConnectStripePage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [status, setStatus] = useState<{ hasAccountId: boolean; payoutsEnabled: boolean; loading: boolean; accountId?: string }>({
        hasAccountId: false,
        payoutsEnabled: false,
        loading: true,
        accountId: undefined
    });
    const { user } = useUserContext();
    const searchParams = useSearchParams();

    useEffect(() => {
        const error = searchParams.get("error");
        if (error === "refresh") {
            toast.error("The previous session expired. Please try connecting again.");
        }

        const checkStatus = async () => {
            try {
                const token = await getAuthToken();
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/stripe/status`, {
                    headers: { Authorization: `bearer ${token}` }
                });
                const data = await res.json();


                setStatus({ 
                    hasAccountId: !!data.hasAccountId, 
                    payoutsEnabled: !!data.payoutsEnabled, 
                    loading: false,
                    accountId: data.accountId
                });
            } catch (error) {
                setStatus(prev => ({ ...prev, loading: false }));
            }
        };
        checkStatus();
    }, [searchParams]);

    const handleConnect = async () => {
        setLoading(true);
        try {
            const token = await getAuthToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/stripe/connect`, {
                method: "POST",
                headers: { Authorization: `bearer ${token}` }
            });
            const data = await res.json();
            if (data.success && data.url) {
                window.location.href = data.url;
            } else {
                toast.error(data.message || "Failed to start onboarding");
            }
        } catch (error) {
            
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
                <h1 className="text-3xl font-bold mb-4">Payout Settings</h1>
                <p className="mb-8 text-muted-foreground">
                    {status.payoutsEnabled 
                        ? "Your Stripe account is connected and ready to receive payments."
                        : status.hasAccountId
                        ? "Your Stripe account is created but payouts are not yet enabled. Please visit your Stripe Dashboard to verify your identity and complete the setup."
                        : "To host events and receive payments, you need to connect a Stripe account. We use Stripe to ensure you get 98% of every booking instantly."}
                </p>
                {status.hasAccountId && status.accountId && (
                    <div className="mb-8 rounded-xl border border-border bg-background p-4 text-left">
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Stripe Account ID</p>
                        <code className="text-sm font-mono text-blue-600 break-all select-all">{status.accountId}</code>
                    </div>
                )}
                {status.loading ? (
                    <div className="w-full h-12 bg-primary animate-pulse rounded-xl" />
                ) : status.payoutsEnabled ? (
                    <div className="w-full rounded-xl border border-border bg-background py-4 font-bold text-foreground">
                        ✓ Account Connected
                    </div>
                ) : status.hasAccountId ? (
                    <a 
                        href={`https://dashboard.stripe.com/${status.accountId}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block w-full rounded-xl bg-primary py-4 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Verify on Stripe Dashboard
                    </a>
                ) : (
                    <button
                        onClick={handleConnect}
                        disabled={loading}
                        className="w-full cursor-pointer rounded-xl bg-primary py-4 font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                    >
                        {loading ? "Loading..." : "Connect with Stripe"}
                    </button>
                )}
            </div>
        </div>
    );
}