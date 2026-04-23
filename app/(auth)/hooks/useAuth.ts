import toast from 'react-hot-toast';
import { useHandleAuthSuccess } from '@/app/(auth)/hooks/useHandleAuthSuccess';
import { useRouter } from 'next/navigation';
interface credentials {
  email: string;
  password: string;
}
export const useAuth = () => {
  const handleAuthSuccess = useHandleAuthSuccess();
  const router = useRouter();
  const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;
  
  const signIn = async (credentials: credentials) => {
    try {
      const response = await fetch(`${API_DOMAIN}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const result = await response.json();
      if (!response.ok) return toast.error(result.message);

      handleAuthSuccess(result.data.authentication_token, result.data.profile_photo);
    } catch (error) {
      toast.error('An error occurred during signin.');
    }
  };

  {/*
  const signUp = async (data: any) => {
    try {
      const response = await fetch(`${API_DOMAIN}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) return toast.error(result.message);
      toast.success(result.message);
    } catch (error) {
      toast.error('An error occurred during signup.');
    }
  };
  */}

  const googleSignIn = async (credential: string) => {
    try {
      const res = await fetch(`${API_DOMAIN}/auth/google-signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credential }),
      });
      const data = await res.json();
      if (res.ok) {
        handleAuthSuccess(data.data.authentication_token, data.data.profile_photo);
      } else {
        router.push(`/google-signup?token=${credential}`);
      }
    } catch (error) {
      toast.error('An error occurred during Google Sign-In.');
    }
  };

  const googleSignUp = async (credential: string, role: string) => {
    try {
      const res = await fetch(`${API_DOMAIN}/auth/google-signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credential, role }),
      });
      const result = await res.json();
      if (!res.ok) return toast.error(result.message || 'Sign up failed');
      if (result.data.authentication_token) {
        handleAuthSuccess(result.data.authentication_token, result.data.profile_photo, 'Sign up successful!');
      }
    } catch (error) {
      toast.error('An error occurred during Google Sign-Up.');
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await fetch(`${API_DOMAIN}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error occurred while sending password reset request.');
    }
  };

  const resetPassword = async (password: string, token: string) => {
    try {
      const response = await fetch(`${API_DOMAIN}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, token }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        router.replace('/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error occurred while resetting password.');
    }
  };

  return { signIn, googleSignIn, googleSignUp, forgotPassword, resetPassword };
};