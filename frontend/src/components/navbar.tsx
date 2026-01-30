import { NavLink } from "react-router";

export default function Navbar() {
    return (
        <nav>
            <NavLink to="/">
                Home
            </NavLink>
            <NavLink to="/Profile">
                Profile
            </NavLink>
        </nav>
    );
}
