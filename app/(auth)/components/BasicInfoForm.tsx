"use client"
import { useFormContext } from "react-hook-form";
import { signUpSchema } from "@/app/(auth)/signup/schema";
import { z } from "zod";

type SignupSchemaType = z.infer<typeof signUpSchema>;

const BasicInfoForm = ({ onNext }: { onNext: () => void }) => {
    const { register, formState: { errors } } = useFormContext<SignupSchemaType>();
    return (
        <>
            <div className="mb-4">
                <label htmlFor="email" className="block text-foreground">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    placeholder="example@example.com"
                    className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-border focus:ring-ring'}`}
                    {...register("email")}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div className="mb-4">
                <label htmlFor="username" className="block text-foreground">
                    Username
                </label>
                <input
                    type="text"
                    id="username"
                    placeholder="username"
                    className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 ${errors.username ? 'border-red-500 focus:ring-red-500' : 'border-border focus:ring-ring'}`}
                    {...register("username")}
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="block text-foreground">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    placeholder="password"
                    className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-border focus:ring-ring'}`}
                    {...register("password")}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div className="mb-4">
                <label htmlFor="confirm-password" className="block text-foreground">
                    Confirm Password
                </label>
                <input
                    type="password"
                    id="confirm-password"
                    placeholder="password"
                    className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-border focus:ring-ring'}`}
                    {...register("confirmPassword")}
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <button type="button" onClick={onNext} className="w-full rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90">
                Next
            </button>
        </>
    );
};

export default BasicInfoForm;