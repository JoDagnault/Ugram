import type { ComponentType, SVGProps } from 'react';
import { useNavigate } from 'react-router';

interface NavbarItemLogoutProps {
    label: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export default function NavbarItemLogout({
    label,
    icon: Icon,
}: NavbarItemLogoutProps) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        navigate('/login');
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
