"use client"
import { useState, useEffect } from "react";
import { Toaster, toast } from 'react-hot-toast';
import { useRouter, useSearchParams } from "next/navigation";
import PublicLayout from "../layout";

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            toast.error('Invalid token');
            router.push('/login');
        }
    }, [token, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/auth/admin-signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password, token, username }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(data.message);
                router.push('/login');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Error occurred while sending password reset request.');
        }
    };

    if (!token) return null;

    return (
        <form onSubmit={handleSubmit}>
            <div className="bg-background p-8 rounded-2xl shadow-lg">
                <Toaster position="top-center" />
                <h2 className="text-2xl font-bold mb-4">Register</h2>
                <div className="flex flex-col gap-4">
                    <input
                    
                        type="text"
                        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        required
                    />
                    <input
                    
                        type="password"
                        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                    <input
                        type="password"
                        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        required
                    />
                    <button
                        className="w-full rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                        type="submit"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </form>
    );
}

export default ResetPassword;