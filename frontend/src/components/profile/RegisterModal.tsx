import { useState } from 'react';
import { useNavigate } from 'react-router';
import { registerWithGoogle } from '../../api/auth/authService.ts';
import { getMe } from '../../api/users/usersService.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { z } from 'zod';

const RegisterSchema = z.object({
    username: z
        .string()
        .trim()
        .min(1, 'Username is required')
        .max(30, 'Maximum 30 characters for the username.')
        .regex(
            /^[\p{L}\p{N}_-]+$/u,
            'Only letters, numbers, underscores and hyphens are allowed',
        ),
    firstName: z
        .string()
        .trim()
        .min(1, 'First name is required')
        .max(100, 'Maximum 100 characters for the first name.')
        .regex(
            /^[\p{L} -]+$/u,
            'Only letters, spaces and hyphens are allowed for the first name.',
        ),
    lastName: z
        .string()
        .trim()
        .min(1, 'Last name is required')
        .max(100, 'Maximum 100 characters for the last name.')
        .regex(
            /^[\p{L} -]+$/u,
            'Only letters, spaces and hyphens are allowed for the last name.',
        ),
    phoneNumber: z
        .string()
        .min(1, 'Phone number is required')
        .regex(
            /^\d{3}-\d{3}-\d{4}$/,
            'Phone number format must be xxx-xxx-xxxx with only numbers',
        ),
});

interface RegisterModalProps {
    idToken: string;
    googleUser: {
        email: string;
        given_name: string;
        family_name: string;
        picture?: string;
    };
    onClose: () => void;
}

export default function RegisterModal({
    idToken,
    googleUser,
    onClose,
}: RegisterModalProps) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState(googleUser.given_name);
    const [lastName, setLastName] = useState(googleUser.family_name);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { setMe } = useAuth();

    const handleSubmit = async () => {
        const result = RegisterSchema.safeParse({
            username,
            firstName,
            lastName,
            phoneNumber,
        });

        if (!result.success) {
            setError(result.error.issues[0].message);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await registerWithGoogle(
                idToken,
                result.data.username,
                result.data.firstName,
                result.data.lastName,
                result.data.phoneNumber,
            );
            localStorage.setItem('jwt', data.jwt);
            const me = await getMe();
            setMe(me ?? null);
            window.dispatchEvent(new Event('auth-login'));
            navigate('/');
            onClose();
        } catch (err: any) {
            setError(err.message ?? 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-scroll"
            onClick={onClose}
        >
            <div
                className="relative bg-[#111] border border-white/10 rounded-2xl p-8 w-full max-w-sm shadow-2xl flex flex-col gap-5"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="space-y-1">
                    <h2 className="text-white text-lg font-semibold tracking-tight">
                        Create your account
                    </h2>
                </div>

                <div className="h-px w-full bg-white/10" />

                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-gray-400 text-xs uppercase tracking-widest mb-1">
                                Username
                            </label>
                            <input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="border border-white rounded-sm px-2 py-1"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-gray-400 text-xs uppercase tracking-widest mb-1">
                                First Name
                            </label>
                            <input
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="border border-white rounded-sm px-2 py-1"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-gray-400 text-xs uppercase tracking-widest mb-1">
                                Last Name
                            </label>
                            <input
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="border border-white rounded-sm px-2 py-1"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-gray-400 text-xs uppercase tracking-widest mb-1">
                            Phone Number
                        </label>
                        <input
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="border border-white rounded-sm px-2 py-1"
                        />
                    </div>
                </div>

                {error && <p className="text-red-400 text-xs">{error}</p>}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-3 py-2 rounded-full border dark:border-gray-500 bg-accent hover:bg-accent/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors mt-2"
                >
                    {loading ? 'Creating account…' : 'Create account'}
                </button>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition text-lg leading-none"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
