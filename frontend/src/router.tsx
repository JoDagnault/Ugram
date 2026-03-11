import { createBrowserRouter } from 'react-router';
import App from './App.tsx';
import Home from './pages/home.tsx';
import NotFound from './pages/not-found.tsx';
import UserProfile from './pages/profile.tsx';
import Users from './pages/search.tsx';
import Login from './pages/login.tsx';
import ProtectedRoute from './components/layout/ProtectedRoute.tsx';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: 'login', element: <Login /> },
            {
                element: <ProtectedRoute />,
                children: [
                    { index: true, element: <Home /> },
                    { path: 'Profile/me', element: <UserProfile /> },
                    { path: 'Profile/:userId', element: <UserProfile /> },
                    { path: 'Search', element: <Users /> },
                ],
            },
            { path: '*', element: <NotFound /> },
        ],
    },
]);

export default router;
