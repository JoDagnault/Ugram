import type { ComponentType, SVGProps } from 'react';
import { NavLink } from 'react-router';

interface NavbarItemProps {
    to: string;
    label: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export default function NavbarItem({ to, label, icon: Icon }: NavbarItemProps) {
    return (
        <NavLink
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
                `hover:text-accent flex items-center flex-col md:flex-row mx-1 ${
                    isActive ? 'text-accent' : ''
                }`
            }
        >
            {({ isActive }) => (
                <>
                    <Icon className="size-6 mx-1" />
                    <p
                        className={`text-sm md:text-base  md:hidden${
                            isActive
                                ? 'invisible md:block'
                                : 'invisible md:hidden'
                        }`}
                    >
                        {label}
                    </p>
                </>
            )}
        </NavLink>
    );
}
