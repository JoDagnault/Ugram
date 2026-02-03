import { NavLink } from 'react-router';

export default function Navbar() {
    return (
        <nav className="sticky top-0 w-full flex justify-around p-3 bg-white dark:bg-dark">
            <NavLink to="/" className="hover:text-accent">
                Home
            </NavLink>
            <NavLink to="/Search" className="hover:text-accent">
                Search
            </NavLink>
            <NavLink to="/Profile" className="hover:text-accent">
                Profile
            </NavLink>
        </nav>
    );
}
