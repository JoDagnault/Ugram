import { Outlet, useLocation } from 'react-router';
import Navbar from './components/layout/Navbar.tsx';

function App() {
    const location = useLocation();
    const hideNavbar = ['/login'].includes(location.pathname);

    return (
        <div className="min-h-dvh bg-dark text-white">
            {!hideNavbar && <Navbar />}
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default App;
