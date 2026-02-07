import { NavLink } from 'react-router';
import { MagnifyingGlassCircleIcon } from '@heroicons/react/24/outline';
import { HomeIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import UgramLettering from '../assets/ugramLettering.tsx';

export default function Navbar() {
    return (
        <div className="bg-gradient-to-r from-primary to-secondary pb-[2px] rounded sticky top-0 w-full ">
            <nav className="flex justify-between px-3 pt-3 pb-2 md:pb-1 bg-dark">
                <UgramLettering className="hidden md:block"></UgramLettering>
                <div className="flex justify-between w-full md:w-fit">
                    <NavLink
                        to="/"
                        className="group hover:text-accent flex items-center flex-col md:flex-row mx-1"
                    >
                        <HomeIcon className="size-6 mx-1" />
                        <p className="text-sm md:text-base md:hidden group-hover:block">
                            Home
                        </p>
                    </NavLink>
                    <NavLink
                        to="/Search"
                        className="group hover:text-accent flex items-center flex-col md:flex-row mx-1"
                    >
                        <MagnifyingGlassCircleIcon className="size-6 mx-1" />
                        <p className="text-sm md:text-base md:hidden group-hover:block">
                            Search
                        </p>
                    </NavLink>
                    <NavLink
                        to="/Profile"
                        className="group hover:text-accent flex items-center flex-col md:flex-row mx-1"
                    >
                        <UserCircleIcon className="size-6 mx-1" />
                        <p className="text-sm md:text-base md:hidden group-hover:block">
                            Profile
                        </p>
                    </NavLink>
                </div>
            </nav>
        </div>
    );
}
