"use client"
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
;

function SuccessContent() {
    const router = useRouter();
    const [seconds, setSeconds] = useState(3);

    useEffect(() => {
        if (seconds <= 0) {
            router.push('/payment');
            return;
        }

        const timer = setInterval(() => {
            setSeconds(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [seconds, router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="bg-background rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                <div className="flex flex-col items-center gap-6">
                    <Spinner className="size-8" />
                    <h1 className="text-2xl font-bold">Payment Processing</h1>
                    <p className="text-muted-foreground">Your booking is being finalized. Thank you for choosing Boothbnb.</p>
                    <div className="bg-primary px-4 py-2 rounded-full text-sm font-semibold text-primary-foreground">
                        Redirecting in {seconds}s...
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Success() {
    return (
        <Suspense>
            <SuccessContent />
        </Suspense>
    );
}