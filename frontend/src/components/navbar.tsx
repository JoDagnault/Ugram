import { NavLink } from 'react-router';
import UgramLogo from '../assets/ugramOutline.tsx';
import UgramLettering from '../assets/ugramLettering.tsx';

export default function Navbar() {
    return (
        <div className="bg-gradient-to-r from-primary to-secondary pb-[2px] rounded sticky top-0 w-full ">
            <nav className="flex justify-between px-3 pt-3 pb-2 md:pb-1 bg-dark">
                <NavLink
                    to="/"
                    className="hover:text-accent flex items-center flex-col"
                >
                    <UgramLogo className="w-6 h-6 block md:hidden" />
                    <p className="text-sm block md:hidden">Home</p>
                    <UgramLettering className="hidden md:block"></UgramLettering>
                </NavLink>
                <NavLink
                    to="/Search"
                    className="hover:text-accent flex items-center flex-col md:flex-row"
                >
                    <UgramLogo className="w-6 h-6 mx-1" />
                    <p className="text-sm md:text-base">Search</p>
                </NavLink>
                <NavLink
                    to="/Profile"
                    className="hover:text-accent flex items-center flex-col md:flex-row"
                >
                    <UgramLogo className="w-6 h-6 mx-1" />
                    <p className="text-sm md:text-base">Profile</p>
                </NavLink>
            </nav>
        </div>
    );
}
