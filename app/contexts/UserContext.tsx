'use client'
import { useState, useContext, createContext, useCallback, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { deleteAuthToken } from '@/app/contexts/auth';

export interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  profile_photo?: string | null;
}

export interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children, initialUser }: { children: ReactNode, initialUser: User | null }) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {

      setUser(prevUser => {
        if (initialUser?.id === prevUser?.id) return prevUser;
        return initialUser;
      });
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [initialUser]);

  const logout = useCallback(async () => {
    setUser(null);
    await deleteAuthToken();
    router.push('/login');
    router.refresh();
  }, [router]);

  return (
    <UserContext.Provider value={{ user, setUser, logout, isLoading }}>
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
