import { useState } from 'react';
import { useNavigate } from 'react-router';
import { registerWithGoogle } from '../../api/auth/googleAuthResponse.ts';

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

    const handleSubmit = async () => {
        if (firstName.length > 250 || lastName.length > 250) {
            setError(
                'Maximum 250 characters for the first and last name and username.',
            );
            return;
        } else if (
            !/^[\p{L} -]+$/u.test(firstName) ||
            !/^[\p{L} -]+$/u.test(lastName)
        ) {
            setError(
                'Only letters, spaces and hyphens are allowed for the first and last name.',
            );
            return;
        }

        if (username.length > 30) {
            setError('Maximum 30 characters for the username.');
            return;
        }

        if (!/^\d{3}-\d{3}-\d{4}$/.test(phoneNumber)) {
            setError(
                'Phone number format must be xxx-xxx-xxxx with only numbers',
            );
            return;
        }
        if (
            !username.trim() ||
            !firstName.trim() ||
            !lastName.trim() ||
            !phoneNumber.trim()
        ) {
            setError('All fields are required');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await registerWithGoogle(
                idToken,
                username,
                firstName,
                lastName,
                phoneNumber,
            );
            localStorage.setItem('jwt', data.jwt);
            navigate('/');
        } catch (err: any) {
            setError(err.message ?? 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
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
                            <label className="text-gray-400 text-xs uppercase tracking-widest">
                                Username
                            </label>
                            <input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="border border-white/20 rounded-sm px-2 py-1"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-gray-400 text-xs uppercase tracking-widest">
                                First Name
                            </label>
                            <input
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="border border-white/20 rounded-sm px-2 py-1"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-gray-400 text-xs uppercase tracking-widest">
                                Last Name
                            </label>
                            <input
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="border border-white/20 rounded-sm px-2 py-1"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-gray-400 text-xs uppercase tracking-widest">
                            Phone Number
                        </label>
                        <input
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="border border-white/20 rounded-sm px-2 py-1"
                        />
                    </div>
                </div>

                {error && <p className="text-red-400 text-xs">{error}</p>}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-white text-black text-sm font-medium rounded-full py-2.5 hover:bg-gray-200 transition disabled:opacity-50 mt-2"
                >
                    {loading ? 'Creating account…' : 'Create account'}
                </button>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-white transition text-lg leading-none"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
