"use client"
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster, toast } from 'react-hot-toast';
import RoleSelection from "@/app/(auth)/components/RoleSelection";
import BasicInfoForm from "@/app/(auth)/components/BasicInfoForm";
import PublicLayout from "@/app/(auth)/layout";

export const signUpSchema = z
  .object({
    email: z.string().email({ message: "Invalid email" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    confirmPassword: z.string(),
    role: z.enum(["VENDOR", "HOST"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupSchemaType = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const [step, setStep] = useState(1);

  const methods = useForm<SignupSchemaType>({
    resolver: zodResolver(signUpSchema)
  });

  const nextStep = async () => {
    const valid = await methods.trigger(["email", "username", "password", "confirmPassword"]);
    const errors = methods.formState.errors;
    const { email, username, password, confirmPassword } = methods.getValues();
    if (valid && !errors.confirmPassword) {
      setStep(2);
    }
    else {
      if (!(password === confirmPassword)) {
        methods.setError("confirmPassword", {
          type: "manual",
          message: "Passwords do not match"
        });
      }
    };

  }
    const prevStep = () => setStep(1);

    const onSubmit = async (data: SignupSchemaType) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/auth/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) {
          return toast.error(result.message);
        }
        toast.success(result.message);

      } catch (error: any) {
        toast.error("An error occurred during signup.");
      }
    };

    return (
      <div className="bg-background p-8 rounded-2xl shadow-lg">
        <Toaster position="top-center" reverseOrder={false} />
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {step === 1 && <BasicInfoForm onNext={nextStep} />}
            {step === 2 && <RoleSelection onBack={prevStep} />}
          </form>
        </FormProvider>
      </div>
    );
  }

  export default SignUp;