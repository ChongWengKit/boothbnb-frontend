"use client"
import { useState, useEffect } from "react";
import { Toaster, toast } from 'react-hot-toast';
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const adminSignupSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters").max(50, "Username must be at most 50 characters"),
    password: z.string().min(8, "Password must be at least 8 characters").max(128, "Password must be at most 128 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type AdminSignupSchemaType = z.infer<typeof adminSignupSchema>;

const AdminSignup = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AdminSignupSchemaType>({
        resolver: zodResolver(adminSignupSchema),
    });

    useEffect(() => {
        if (!token) {
            toast.error('Invalid token');
            router.push('/login');
        }
    }, [token, router]);

    const onSubmit = async (values: AdminSignupSchemaType) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/auth/admin-signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    password: values.password, 
                    username: values.username, 
                    token 
                }),
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
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-background p-8 rounded-2xl shadow-lg">
                <Toaster position="top-center" />
                <h2 className="text-2xl font-bold mb-4">Register</h2>
                <div className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="username" className="block text-foreground">Username</label>
                        <input
                            type="text"
                            className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 ${errors.username ? 'border-red-500 focus:ring-red-500' : 'border-border focus:ring-ring'}`}
                            placeholder="Enter your username"
                            {...register("username")}
                        />
                        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-foreground">Password</label>
                        <input
                            type="password"
                            className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-border focus:ring-ring'}`}
                            placeholder="Enter your password"
                            {...register("password")}
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-foreground">Confirm Password</label>
                        <input
                            type="password"
                            className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-border focus:ring-ring'}`}
                            placeholder="Confirm your password"
                            {...register("confirmPassword")}
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                    </div>
                    <button
                        className="w-full rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Loading...' : 'Register'}
                    </button>
                </div>
            </div>
        </form>
    );
}
export default AdminSignup;