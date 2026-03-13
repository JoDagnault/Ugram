import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router';
import UgramLettering from '../assets/ugramLettering.tsx';
import { useState } from 'react';
import RegisterModal from '../components/profile/RegisterModal.tsx';
import { loginWithGoogle } from '../api/auth/authService.ts';
import * as Sentry from '@sentry/react';

export default function Login() {
    const navigate = useNavigate();
    const [pendingToken, setPendingToken] = useState<string | null>(null);
    const [pendingGoogleUser, setPendingGoogleUser] = useState<{
        email: string;
        given_name: string;
        family_name: string;
        picture?: string;
    } | null>(null);

    const handleSuccess = async (credentialResponse: any) => {
        const token = credentialResponse.credential;
        const payload = JSON.parse(atob(token.split('.')[1]));

        try {
            const data = await loginWithGoogle(token);
            localStorage.setItem('jwt', data.jwt);
            Sentry.logger.info(`User ${data.user.id} connected`);
            navigate('/');
        } catch (err: any) {
            if (err.status === 400) {
                setPendingToken(token);
                setPendingGoogleUser({
                    email: payload.email,
                    given_name: payload.given_name,
                    family_name: payload.family_name,
                    picture: payload.picture,
                });
            }
        }
    };

    return (
        <div className="flex flex-col h-dvh">
            <div
                className="h-1 w-full shrink-0"
                style={{
                    background:
                        'linear-gradient(90deg, #FFCC00, #FE4A05, #E30613, #009FE3)',
                }}
            />
            <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
                <div className="text-center space-y-1">
                    <UgramLettering />
                    <p className="text-gray-500 text-sm font-light">
                        Login or create a new account with Google
                    </p>
                </div>

                <div className="w-full max-w-sm h-px bg-dark-gray" />

                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={() => new Error('Login Failed')}
                    use_fedcm_for_prompt={false}
                    width="255"
                    theme="filled_black"
                    shape="pill"
                />
            </div>
            {pendingToken && pendingGoogleUser && (
                <RegisterModal
                    idToken={pendingToken}
                    googleUser={pendingGoogleUser}
                    onClose={() => {
                        setPendingToken(null);
                        setPendingGoogleUser(null);
                    }}
                />
            )}
        </div>
    );
}
