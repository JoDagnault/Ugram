import { createBrowserRouter } from 'react-router';

import App from './App.tsx';
import Home from './pages/home.tsx';
import Profile from './pages/profile.tsx';
import Users from './pages/users.tsx';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <Home /> },
            { path: 'Profile', element: <Profile /> },
            { path: 'Users', element: <Users /> },
        ],
    },
]);

export default router;
