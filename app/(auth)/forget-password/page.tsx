"use client"
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    return (
        <form onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/auth/forgot-password`, {
                    method: 'POST',
                    body: JSON.stringify({ email }),
                    headers: { 'Content-Type': 'application/json' },
                });
                const data = await response.json();
                if (response.ok) {
                    toast.success(data.message);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error("Failed to send reset password email. Please try again later.");
            } finally {
                setLoading(false);
            }
        }}>
            <div className="bg-background p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
                <div className="flex flex-col gap-4">
                    <label className="block text-foreground" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                    <button
                        className="w-full rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Submit'}
                    </button>
                </div>
            </div>
        </form>
    )
}
export default ForgotPassword;