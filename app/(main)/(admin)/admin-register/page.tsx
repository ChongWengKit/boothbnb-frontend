'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { getAuthToken } from "@/app/contexts/auth";

const AdminRegisterPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        const token = await getAuthToken();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/admin/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `bearer ${token}`,
                },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();
            if (response.ok) {
                toast.success(result.message || "Invitation sent successfully");
                setEmail('');
            } else {
                toast.error(result.message || "Failed to register admin");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-full min-h-[80vh] items-center justify-center bg-background">
            <form onSubmit={handleRegister} className="flex w-full max-w-md flex-col gap-4 p-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Register New Admin</h1>
                    <p className="text-sm text-muted-foreground">Send an invitation to a new administrator.</p>
                </div>
                <input
                    type="email"
                    placeholder="Admin Email Address"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Button 
                    type="submit" 
                    className="w-full cursor-pointer"
                    disabled={loading}
                >
                    {loading ? "Sending..." : "Send Invitation"}
                </Button>
            </form>
        </div>
    );
};

export default AdminRegisterPage;