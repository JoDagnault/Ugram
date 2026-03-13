import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import type { ComponentType, SVGProps } from 'react';

interface NavbarItemLogoutProps {
    label: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export default function NavbarItemLogout({
    label,
    icon: Icon,
}: NavbarItemLogoutProps) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (!ref.current) return;
            if (!ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        navigate('/login');
    };

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="w-9 h-9 flex items-center justify-center text-white hover:text-accent transition"
                aria-label="Menu"
            >
                <Icon className="size-6" />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-40 border rounded-md bg-dark shadow">
                    <button
                        type="button"
                        onClick={() => {
                            setOpen(false);
                            handleLogout();
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-dark-secondary text-red-500 rounded-md"
                    >
                        {label}
                    </button>
                </div>
            )}
        </div>
    );
}
