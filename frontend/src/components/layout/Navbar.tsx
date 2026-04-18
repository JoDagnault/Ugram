import { NavLink } from 'react-router';
import {
    MagnifyingGlassCircleIcon,
    Bars3Icon,
    BellIcon,
} from '@heroicons/react/24/outline';
import { HomeIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import UgramLettering from '../../assets/ugramLettering.tsx';
import NavbarItem from './NavbarItem.tsx';
import NavbarItemLogout from './NavbarItemLogout.tsx';
import { useNotifications } from '../../context/NotificationContext.tsx';

export default function Navbar() {
    const { hasUnread } = useNotifications();

    return (
        <div
            style={{
                background:
                    'linear-gradient(90deg, #FFCC00, #FE4A05, #E30613, #009FE3)',
            }}
            className="pb-0.5 rounded sticky top-0 w-full"
        >
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
                    <div className="relative flex flex-col items-center mx-1 md:mx-0 md:flex-row">
                        <NavbarItem
                            to="/Notifications"
                            label="Notifications"
                            icon={BellIcon}
                        />
                        {hasUnread && (
                            <span className="absolute top-0 right-0 size-2.5 rounded-full bg-red-500" />
                        )}
                    </div>
                    <NavbarItemLogout label="Logout" icon={Bars3Icon} />
                </div>
            </nav>
        </div>
    );
}
