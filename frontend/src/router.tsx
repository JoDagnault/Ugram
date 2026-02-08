import { createBrowserRouter } from 'react-router';

import App from './App.tsx';
import Home from './pages/home.tsx';
import UserProfile from './pages/profile.tsx';
import Users from './pages/search.tsx';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <Home /> },
            { path: 'Profile', element: <UserProfile /> },
            { path: 'Profile/:userId', element: <UserProfile /> },
            { path: 'Search', element: <Users /> },
        ],
    },
]);

export default router;
