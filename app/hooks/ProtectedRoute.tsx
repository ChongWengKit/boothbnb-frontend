"use client"
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/app/contexts/UserContext';
import { useEffect } from 'react';

interface Props {
  allowedRoles: string[];
  children: React.ReactNode;
}

const RoleGuard = ({ allowedRoles, children }: Props) => {
  const { user, isLoading } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace('/');
      } else if (!allowedRoles.includes(user.role)) {
        router.replace('/dashboard');
      }
    }
  }, [user, isLoading, router, allowedRoles]);

  if (isLoading || !user || !allowedRoles.includes(user.role)) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default RoleGuard;