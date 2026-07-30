'use client'

import { useRouter } from 'next/navigation';
import { useUserContext } from '@/app/contexts/UserContext';
import { jwtDecode } from "jwt-decode";
import toast from 'react-hot-toast';
import type { User } from '@/app/contexts/UserContext';
import { setAuthToken } from '@/app/contexts/auth';
//test
export const useHandleAuthSuccess = () => {
  const router = useRouter();
  const { setUser } = useUserContext();

  return async (token: string, profile_photo?: string, successMessage: string = 'Sign in successful!') => {
    await setAuthToken(token, profile_photo);
    const decoded = jwtDecode<User>(token);
    setUser(decoded);
    if (profile_photo) {
      decoded.profile_photo = profile_photo;

    }
    toast.success(successMessage);
    router.push('/dashboard');
  };
};