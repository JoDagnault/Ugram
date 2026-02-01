import { NavLink } from 'react-router';

export default function Navbar() {
  return (
    <nav className="sticky top-0 w-full flex justify-between p-3">
      <NavLink to="/" className="hover:text-accent">
        Home
      </NavLink>
      <NavLink to="/Users" className="hover:text-accent">
        Users
      </NavLink>
      <NavLink to="/Profile" className="hover:text-accent">
        Profile
      </NavLink>
    </nav>
  );
}
