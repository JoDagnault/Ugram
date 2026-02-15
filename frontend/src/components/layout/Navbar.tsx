import { NavLink } from 'react-router';
import { MagnifyingGlassCircleIcon } from '@heroicons/react/24/outline';
import { HomeIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import UgramLettering from '../../assets/ugramLettering.tsx';
import NavbarItem from './NavbarItem.tsx';

export default function Navbar() {
    return (
        <div className="bg-gradient-to-r from-primary to-secondary pb-[2px] rounded sticky top-0 w-full ">
            <nav className="flex justify-between px-3 pt-3 pb-2 md:pb-1 bg-dark">
                <NavLink
                    to="/"
                    end
                    className="hidden md:block hover:text-accent"
                >
                    <UgramLettering></UgramLettering>
                </NavLink>
                <div className="flex justify-between w-full md:w-fit">
                    <NavbarItem to="/" label="Home" icon={HomeIcon} />
                    <NavbarItem
                        to="/Search"
                        label="Search"
                        icon={MagnifyingGlassCircleIcon}
                    />
                    <NavbarItem
                        to="/Profile/me"
                        label="Profile"
                        icon={UserCircleIcon}
                    />
                </div>
            </nav>
        </div>
    );
}
