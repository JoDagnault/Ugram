import type { ComponentType, SVGProps } from 'react';
import { useNavigate } from 'react-router';
import { logout } from '../../api/auth/authService.ts';
import * as Sentry from '@sentry/react';

interface NavbarItemLogoutProps {
    label: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export default function NavbarItemLogout({
    label,
    icon: Icon,
}: NavbarItemLogoutProps) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('jwt');
            await logout(token!);
            Sentry.logger.info('User logged out');
            localStorage.removeItem('jwt');
            navigate('/login');
        } catch (error: any) {
            Sentry.logger.warn('logout failed');
            throw new Error('logout failed');
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="hover:text-accent flex items-center flex-col md:flex-row mx-1 group"
        >
            <Icon className="size-6 mx-1" />
            <p className="text-sm md:text-base hidden group-hover:block">
                {label}
            </p>
        </button>
    );
}
