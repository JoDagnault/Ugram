import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import ReactGA from 'react-ga4';
import Navbar from './components/layout/Navbar.tsx';
import { config } from './config';

function App() {
    const location = useLocation();
    const hideNavbar = ['/login'].includes(location.pathname);

    useEffect(() => {
        if (!config.analytics.GA_MEASUREMENT_ID) return;

        ReactGA.send({
            hitType: 'pageview',
            page: location.pathname + location.search,
        });
    }, [location.pathname, location.search]);

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
