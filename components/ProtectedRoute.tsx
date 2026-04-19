"use client"
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/app/contexts/UserContext';
import { useEffect } from 'react';

interface Props {
  allowedRoles: string[];
  children: React.ReactNode;
}

const RoleGuard = ({ allowedRoles, children }: Props) => {
  const { user } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/');
    } else if (!allowedRoles.includes(user.role)) {
      router.replace('/dashboard');
    }
  }, [user, router, allowedRoles]);


  return <>{children}</>;
};

export default RoleGuard;