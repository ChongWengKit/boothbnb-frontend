"use client"
import toast, { Toaster } from 'react-hot-toast';
import PublicLayout from '@/app/(auth)/layout';

const ForgotPassword = () => {
    return (
        <form onSubmit={async (e) => {
            e.preventDefault();
            const email = (document.getElementById('email') as HTMLInputElement).value;
            if (!email) {
                toast.error('Email is required.');
                return;
            }
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
            }
        }}>
            <div className="bg-background p-8 rounded-2xl shadow-lg">
                <Toaster position="top-center" reverseOrder={false} />
                <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
                <div className="flex flex-col gap-4">
                    <label className="block text-foreground" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Enter your email"
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
    )
}
export default ForgotPassword;