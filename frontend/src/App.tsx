import { Outlet } from 'react-router';
import Navbar from './components/layout/Navbar.tsx';

function App() {
    return (
        <div className="min-h-dvh bg-dark text-white">
            <Navbar />
            <main className="pt-1">
                <Outlet />
            </main>
        </div>
    );
}

export default App;
