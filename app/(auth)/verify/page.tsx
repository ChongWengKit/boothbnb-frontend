"use client"
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PublicLayout from "@/app/(auth)/layout";
import Cookies from "js-cookie";
import { setAuthToken } from "@/app/contexts/auth";
function Verify() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [countDown, setCountDown] = useState(5);

    useEffect(() => {
        if (!token) return;

        const verifyToken = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/auth/verify`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    setIsVerified(true);
                    setAuthToken(data.data.authentication_token, data.data.profile_photo);
                } else {
                    setIsVerified(false);
                }
            } catch (error) {
                setIsVerified(false);
            } finally {
                setIsLoading(false);
            }
        };

        verifyToken();
    }, [token, setAuthToken]); 
    useEffect(() => {
        if (isVerified && countDown > 0) {
            const timer = setInterval(() => {
                setCountDown(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (isVerified && countDown === 0) {
            router.push('/dashboard');
        }
    }, [isVerified, countDown, router]);

    return (
        <div className="bg-background p-8 rounded-2xl shadow-lg">
            {isLoading ? (
                <div className="flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-b-2 border-gray-900 rounded-full mr-2"></div>
                    <p>Verifying...</p>
                </div>
            ) : isVerified ? (
                <div className="text-center">
                    <p className="text-xl font-bold">Email Verified</p>
                    <p>Redirecting in {countDown} seconds...</p>
                </div>
            ) : (
                <div className="text-center text-red-500">
                    <p>Error while verifying email</p>
                </div>
            )}
        </div>
    );
}

export default Verify;