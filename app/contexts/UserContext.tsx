'use client'
import { useState, useContext, createContext, useCallback, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { deleteAuthToken } from '@/app/contexts/auth';

export const UserContext = createContext<any>(null);
export interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  is_stripe_connected: boolean;
  profile_photo?: string | null;
}
export const UserProvider = ({ children, initialUser }: { children: ReactNode, initialUser: User | null }) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const router = useRouter();

  useEffect(() => {
    console.log(user)
    setUser(initialUser);
  }, [initialUser]);

  const logout = useCallback(async () => {
    setUser(null);
    await deleteAuthToken();
    router.push('/login');
    router.refresh();
  }, [router]);

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
