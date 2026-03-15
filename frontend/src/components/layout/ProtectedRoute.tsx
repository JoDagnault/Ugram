import { Navigate, Outlet, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { getMe } from '../../api/users/usersService.ts';

function ProtectedRoute() {
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('jwt');

        if (!token) {
            setIsValid(false);
            return;
        }

        getMe()
            .then(() => {
                setIsValid(true);
            })
            .catch(() => {
                localStorage.removeItem('jwt');
                setIsValid(false);
            });
    }, [location.pathname]);

    if (isValid === null) return null;
    if (!isValid) return <Navigate to="/login" replace />;

    return <Outlet />;
}

export default ProtectedRoute;
