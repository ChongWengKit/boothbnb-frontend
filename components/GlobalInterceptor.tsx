'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/app/contexts/UserContext';
import toast from 'react-hot-toast';
import { is } from 'date-fns/locale';
const GlobalFetchInterceptor = () => {
  const router = useRouter();
  const { logout } = useUserContext();

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_DOMAIN;

  useEffect(() => {

    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const resource = args[0];
      const url = typeof resource === 'string' ? resource : resource instanceof Request ? resource.url : '';
      try {
        const response = await originalFetch(...args);
        const isMyBackend = url.startsWith(BACKEND_URL);
        console.log("INTERCEPTOR RESPONSE:", response.status, response.url);
        if (isMyBackend && response.status === 401) {
          router.push(`/login?reason=session_expired`);
        }

        return response;
      } catch (error) {

        toast.error(`Network Error: ${error.message}.`);
        throw error;
      }
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, [router, logout, BACKEND_URL]);

  return null;
};

export default GlobalFetchInterceptor;