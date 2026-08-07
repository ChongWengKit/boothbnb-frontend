"use client"
import { useEffect } from "react";
import { Toaster, toast } from 'react-hot-toast';
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import PublicLayout from "../layout";

const resetPasswordSchema = z.object({
    password: z.string().min(8, { message: "Password must be at least 8 characters" }).max(128, { message: "Password must be at most 128 characters" }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordSchemaType>({
        resolver: zodResolver(resetPasswordSchema),
    });

    useEffect(() => {
        if (!token) {
            toast.error('Invalid token');
            router.push('/login');
        }
    }, [token, router]);

    const onSubmit = async (values: ResetPasswordSchemaType) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: values.password, token }),
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
                <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
                <div className="flex flex-col gap-4">
                    <div>
                        <input
                            type="password"
                            className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-border focus:ring-ring'}`}
                            placeholder="Enter your password"
                            {...register('password')}
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>
                    <div>
                        <input
                            type="password"
                            className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-border focus:ring-ring'}`}
                            placeholder="Confirm your password"
                            {...register('confirmPassword')}
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                    </div>
                    <button
                        className="w-full rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </form>
    );
}

export default ResetPassword;

     