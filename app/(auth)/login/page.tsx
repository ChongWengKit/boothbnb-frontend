"use client"
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import GoogleSignIn from "@/app/(auth)/components/GoogleSignIn";
import { useAuth } from '@/app/(auth)/hooks/useAuth';
import PublicLayout from '@/app/(auth)/layout';
import { deleteAuthToken } from '@/app/contexts/auth';

const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type SignInSchemaType = z.infer<typeof signInSchema>;

function SignIn() {
    const { signIn } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const reason = searchParams.get('reason');
        
        if (reason === 'session_expired') {
            deleteAuthToken();
            toast.error('Your session has expired. Please log in again.', { id: 'session-expired-error' });
        }
    }, [searchParams]);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInSchemaType>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = async (data: SignInSchemaType) => {
        await signIn(data);
    };

    return (
            <div className="bg-background p-8 rounded-2xl shadow-lg">
                <Toaster position="top-center" reverseOrder={false} />
                <h2 className="text-2xl font-bold mb-4">Sign In</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center gap-8">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="block text-foreground">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="example@example.com"
                            className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-border focus:ring-ring'}`}
                            {...register("email")} />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="block text-foreground">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-border focus:ring-ring'}`}
                            {...register("password")} />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                        <div className="flex justify-end items-end">
                            <button onClick={() => router.push('/forget-password')} type="button" className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground">
                                Forgot Password?
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:bg-muted">
                        {isSubmitting ? "Signing In..." : "Sign In"}
                    </button>
                    <p className="text-center text-muted-foreground">or continue with</p>
                    <GoogleSignIn />
                </form>
            </div>
    )
}

export default SignIn;