import React from 'react';
import { jwtDecode } from "jwt-decode";
import { UserProvider, type User } from "@/app/contexts/UserContext";
import { getAuthToken, getProfilePhoto } from '@/app/contexts/auth';

const SessionProvider = async ({ children }: { children: React.ReactNode }) => {
    const token = await getAuthToken();
    const profile_photo = await getProfilePhoto();

    let user: User | null = null;

    if (token) {
        try {
            const decoded = jwtDecode<User>(token);
            if (decoded && typeof decoded === 'object') {
                user = decoded;
                if (profile_photo) {
                user.profile_photo = profile_photo;
                }
            }
        } catch (e) {
        }
    }

    return (
        <UserProvider initialUser={user}>
            {children}
        </UserProvider>
    );
};

export default SessionProvider;