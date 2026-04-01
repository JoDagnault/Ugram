import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';
import { getMe } from '../api/users/usersService';
import type { MyUser } from '../types/user';

interface AuthContextType {
    me: MyUser | null;
    loading: boolean;
    setMe: (me: MyUser | null) => void;
}

const AuthContext = createContext<AuthContextType>({
    me: null,
    loading: true,
    setMe: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [me, setMe] = useState<MyUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const jwt = localStorage.getItem('jwt');
        if (!jwt) {
            setLoading(false);
            return;
        }
        getMe()
            .then((user) => setMe(user ?? null))
            .catch(() => setMe(null))
            .finally(() => setLoading(false));
    }, []);

    return (
        <AuthContext.Provider value={{ me, loading, setMe }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
