"use client"
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast, { Toaster } from 'react-hot-toast';
import RoleSelection from '@/app/(auth)/components/RoleSelection';
import { useAuth } from '@/app/(auth)/actions/useAuth';
import PublicLayout from '@/app/(auth)/layout';

const roleSchema = z.object({
  role: z.enum(["VENDOR", "HOST"]),
});

type RoleSchemaType = z.infer<typeof roleSchema>;

const GoogleSignup = () => {
  const { googleSignUp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const methods = useForm<RoleSchemaType>({
    resolver: zodResolver(roleSchema)
  });

  const handleRoleSubmit = async (data: RoleSchemaType) => {
    await googleSignUp(data.role);
  };


  return (
        <div className="bg-background p-8 rounded-2xl shadow-lg w-full max-w-md">
            <Toaster position="top-center" reverseOrder={false} />
            <h2 className="text-2xl font-bold mb-4">Select Your Role</h2>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(handleRoleSubmit)}>
                    <RoleSelection onBack={() => router.push('/getstarted')} />
                </form>
            </FormProvider>
        </div>
  );
};

export default GoogleSignup;