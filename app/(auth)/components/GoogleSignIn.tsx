"use client"
import { GoogleLogin, CredentialResponse, GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from 'react-hot-toast';
import { useAuth } from '@/app/(auth)/hooks/useAuth';

const GoogleSignIn = () => {
    const { googleSignIn } = useAuth();

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
            await googleSignIn(credentialResponse.credential);
        }
    };

    return (
        <div>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
                <GoogleLogin onSuccess={handleGoogleSuccess} />
            </GoogleOAuthProvider>
        </div>
    );
};

export default GoogleSignIn;