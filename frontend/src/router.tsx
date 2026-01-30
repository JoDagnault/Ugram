import { createBrowserRouter } from 'react-router';

import App from "./App.tsx";
import Home from "./pages/home.tsx";
import Profile from "./pages/profile.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <Home /> },
            { path: "Profile", element: <Profile /> },
        ],
    },
]);

export default router;
